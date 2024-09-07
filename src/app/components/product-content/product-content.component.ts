import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { PromptService } from '../../services/prompt/prompt.service';
import { AIService } from '../../services/ai/ai.service';
import { Product } from '../../models/product/product';
import { Prompt } from '../../models/prompt/prompt';
import { NotificationService } from '../../services/notification/notification.service';

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
  prosList: string[] = [];
  consList: string[] = [];
  isUpdatingProduct: boolean = false;

  constructor(
    private productService: ProductService,
    private promptService: PromptService,
    private aiService: AIService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPrompts();
    this.loadProvidersAndModels();
  }

  searchProducts(event: any) {
    const query = event.query;
    this.productService.getProducts(0, 10, undefined, undefined, query).subscribe({
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
    this.aiService.getProviders('text', 'chat').subscribe({
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
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to load providers');
      }
    });
  }

  loadPrompts(): void {
    this.promptService.getPromptsByTypeAndOptionalSubtype('Product').subscribe({
      next: (prompts) => {
        this.sectionState['review'].prompts = prompts.filter(p => p.subtype === 'Review');
        this.sectionState['prosCons'].prompts = prompts.filter(p => p.subtype === 'Pros & Cons');
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
    const productId = this.selectedProduct?.id;
    const prompt = this.sectionState[section].selectedPrompt;
    const provider = this.sectionState[section].provider;
    const model = this.sectionState[section].model;

    if (!productId || !prompt || !provider || !model) return;

    this.sectionState[section].isGenerating = true;

    this.aiService.generateProductText(productId, prompt.id!, provider, model.model).subscribe({
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

    this.isUpdatingProduct = true;

    this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct, false).subscribe({
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
