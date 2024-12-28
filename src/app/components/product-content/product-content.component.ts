import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { PromptService } from '../../services/prompt/prompt.service';
import { AIService } from '../../services/ai/ai.service';
import { Product } from '../../models/product/product';
import { Prompt } from '../../models/prompt/prompt';
import { NotificationService } from '../../services/notification/notification.service';
import { SettingsService } from '../../services/settings/settings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.component.html',
  styleUrls: ['./product-content.component.scss']
})
export class ProductContentComponent implements OnInit {
  products: Product[] = [];
  private _selectedProduct: Product | null = null;
  get selectedProduct(): Product | null {
    return this._selectedProduct;
  }
  set selectedProduct(product: Product | null) {
    this._selectedProduct = product;
    this.prosList = product?.pros || [];
    this.consList = product?.cons || [];

    const isEnabled = product !== null;
    this.sectionState['review'].enabled = isEnabled;
    this.sectionState['prosCons'].enabled = isEnabled;
  }

  sectionState: { [key: string]: any } = {
    review: {
      prompts: [] as Prompt[],
      selectedPrompt: null as Prompt | null,
      provider: null as string | null,
      model: null as { model: string, cost: string } | null,
      models: [] as { model: string, cost: string }[],
      enabled: false,
      isGenerating: false,
      cost: ''
    },
    prosCons: {
      prompts: [] as Prompt[],
      selectedPrompt: null as Prompt | null,
      provider: null as string | null,
      model: null as { model: string, cost: string } | null,
      models: [] as { model: string, cost: string }[],
      enabled: false,
      isGenerating: false,
      cost: ''
    }
  };

  providers: string[] = [];
  models: { provider: string, model: string, cost: string }[] = [];
  defaultProvider: string | null = null;
  defaultModel: string | null = null;

  prosList: string[] = [];
  consList: string[] = [];
  isUpdatingProduct: boolean = false;

  blogId: number | null = null;

  constructor(
    private productService: ProductService,
    private promptService: PromptService,
    private aiService: AIService,
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('blogId');
      if (idParam) {
        this.blogId = +idParam;
        this.loadDefaults();
        this.loadPrompts();
        this.loadProvidersAndModels();
      }
    });
  }

  searchProducts(event: any) {
    if (!this.blogId) {
      this.notificationService.showError('Error', 'No blog selected!');
      return;
    }
    const query = event.query;
    this.productService.getProducts(this.blogId, 0, 10, "id", -1, query).subscribe({
      next: (data) => {
        this.products = data.products.map(product => ({
          ...product,
          displayName: `ID: ${product.id}, ${product.name} - ${product.seo_keyword}`
        }));
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to fetch products.');
      }
    });
  }

  
  loadProvidersAndModels(): void {
    if (!this.blogId) {
      return;
    }
    this.aiService.getProviders(this.blogId, 'text', 'chat').subscribe({
      next: (data) => {
        this.providers = Object.keys(data);
        for (const provider in data) {
          if (data.hasOwnProperty(provider)) {
            const models = data[provider];
            models.forEach((modelInfo: { model: string, cost: string }) => {
              this.models.push({ provider: provider, model: modelInfo.model, cost: modelInfo.cost });
            });
          }
        }

        if (this.defaultProvider) {
          this.updateModelsForProvider('review', this.defaultProvider);
          this.updateModelsForProvider('prosCons', this.defaultProvider);
        }
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to load providers');
      }
    });
  }

  updateModelsForProvider(section: string, provider: string): void {
    this.sectionState[section].models = this.models.filter(model => model.provider === provider);

    if (this.defaultModel) {
      const defaultModel = this.sectionState[section].models.find((m: { provider: string, model: string, cost: string }) => m.model === this.defaultModel);
      this.sectionState[section].model = defaultModel || null;
    }
  }

  loadDefaults(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        const providerSetting = settings.find(s => s.key === 'ai.provider.default');
        const modelSetting = settings.find(s => s.key === 'ai.model.default');
        this.defaultProvider = providerSetting?.value || null;
        this.defaultModel = modelSetting?.value || null;

        if (this.defaultProvider) {
          this.sectionState['review'].provider = this.defaultProvider;
          this.sectionState['prosCons'].provider = this.defaultProvider;
        }
      },
      error: () => {
        this.notificationService.showError('Error', 'Failed to load default settings.');
      }
    });
  }

  loadPrompts(): void {
    if (!this.blogId) {
      return;
    }
    this.promptService.getPromptsByTypeAndOptionalSubtype(this.blogId, 'Product').subscribe({
      next: (prompts) => {
        this.sectionState['review'].prompts = prompts.filter(p => p.subtype === 'Review');
        this.sectionState['prosCons'].prompts = prompts.filter(p => p.subtype === 'Pros & Cons');
        this.sectionState['review'].selectedPrompt = this.sectionState['review'].prompts[0];
        this.sectionState['prosCons'].selectedPrompt = this.sectionState['prosCons'].prompts[0];
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to load prompts');
      }
    });
  }

  onProviderChange(section: string, provider: string): void {
    this.sectionState[section].provider = provider;
    this.sectionState[section].models = this.models.filter(model => model.provider === provider);
    this.sectionState[section].model = null;
  }

  generateContent(section: string): void {
    if (!this.blogId) {
      this.notificationService.showError('Error', 'No blog selected!');
      return;
    }
    const productId = this.selectedProduct?.id;
    const prompt = this.sectionState[section].selectedPrompt;
    const provider = this.sectionState[section].provider;
    const model = this.sectionState[section].model;

    if (!productId || !prompt || !provider || !model) return;

    this.sectionState[section].isGenerating = true;

    this.aiService.generateProductText(this.blogId, productId, prompt.id!, provider, model.model).subscribe({
      next: (data) => {
        this.selectedProduct = {
          ...data.product,
          displayName: `ID: ${data.product.id}, ${data.product.name} - ${data.product.seo_keyword}`
        };
        this.sectionState[section].cost = data.cost;
        this.notificationService.showSuccess('Success', `${section} generated successfully`);
        this.sectionState[section].isGenerating = false;
      },
      error: (err) => {
        this.notificationService.showError('Error', `Failed to generate ${section}`);
        this.sectionState[section].isGenerating = false;
      }
    });
  }

  updateProduct(): void {
    if (!this.selectedProduct) return;
    if (!this.blogId) {
      return;
    }

    this.isUpdatingProduct = true;

    this.productService.updateProduct(this.blogId, this.selectedProduct.id, this.selectedProduct, false).subscribe({
      next: () => {
        this.notificationService.showSuccess('Success', 'Product updated successfully');
        this.isUpdatingProduct = false;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to update product');
        this.isUpdatingProduct = false;
      }
    });
  }

  addPros(): void {
    this.prosList.push('');
  }

  removePros(index: number): void {
    this.prosList.splice(index, 1);
  }

  addCons(): void {
    this.consList.push('');
  }

  removeCons(index: number): void {
    this.consList.splice(index, 1);
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  isAnySectionEnabled(): boolean {
    return Object.values(this.sectionState).some(section => section.enabled);
  }
}
