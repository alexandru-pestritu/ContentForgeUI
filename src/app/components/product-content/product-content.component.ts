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
  products: any[] = [];
  selectedProduct: Product | null = null;

  providers: string[] = [];
  models: { provider: string, model: string, cost: string }[] = [];

  reviewPrompts: Prompt[] = [];
  selectedReviewPrompt: Prompt | null = null;
  selectedReviewProvider: string | null = null;
  reviewModels: { model: string, cost: string }[] = [];
  selectedReviewModel: { model: string, cost: string } | null = null;
  reviewCost: string = '';

  prosConsPrompts: Prompt[] = [];
  selectedProsConsPrompt: Prompt | null = null;
  selectedProsConsProvider: string | null = null;
  prosConsModels: { model: string, cost: string }[] = [];
  selectedProsConsModel: { model: string, cost: string } | null = null;
  prosConsCost: string = '';

  prosList: string[] = [];
  consList: string[] = [];

  reviewEnabled: boolean = false;
  prosConsEnabled: boolean = false;

  loading: boolean = false;

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

  // Căutarea produselor pentru p-autocomplete
  searchProducts(event: any) {
    const query = event.query;
    this.productService.getProducts(0, 10, undefined, undefined, query).subscribe({
      next: (data) => {
        this.products = data.products.map(product => ({
          id: product.id,
          name: product.name,
          displayName: `ID: ${product.id}, ${product.name} - ${product.seo_keyword}`
        }));
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to fetch products.');
      }
    });
  }

  // Încărcarea tuturor furnizorilor și modelelor o singură dată
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

  // Când se schimbă furnizorul pentru Review, filtrează modelele
  onReviewProviderChange(provider: string): void {
    this.selectedReviewProvider = provider;
    this.reviewModels = this.models.filter(model => model.provider === provider);
    this.selectedReviewModel = null;
  }

  // Când se schimbă furnizorul pentru Pros & Cons, filtrează modelele
  onProsConsProviderChange(provider: string): void {
    this.selectedProsConsProvider = provider;
    this.prosConsModels = this.models.filter(model => model.provider === provider);
    this.selectedProsConsModel = null;
  }

  // Încărcarea prompturilor pentru review și pros & cons
  loadPrompts(): void {
    this.promptService.getPromptsByTypeAndOptionalSubtype('Product').subscribe({
      next: (prompts) => {
        this.reviewPrompts = prompts.filter(p => p.subtype === 'Review');
        this.prosConsPrompts = prompts.filter(p => p.subtype === 'Pros & Cons');
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to load prompts');
      }
    });
  }

  // Generare Review
  generateReviewContent(): void {
    if (!this.selectedProduct || !this.selectedReviewPrompt || !this.selectedReviewProvider || !this.selectedReviewModel) return;

    this.loading = true;
    this.aiService.generateProductText(this.selectedProduct.id, this.selectedReviewPrompt.id!, this.selectedReviewProvider, this.selectedReviewModel.model).subscribe({
      next: (data) => {
        this.selectedProduct = data.product;
        this.reviewCost = data.cost;
        this.notificationService.showSuccess('Success', 'Review generated successfully');
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to generate review');
        this.loading = false;
      }
    });
  }

  // Generare Pros & Cons
  generateProsConsContent(): void {
    if (!this.selectedProduct || !this.selectedProsConsPrompt || !this.selectedProsConsProvider || !this.selectedProsConsModel) return;

    this.loading = true;
    this.aiService.generateProductText(this.selectedProduct.id, this.selectedProsConsPrompt.id!, this.selectedProsConsProvider, this.selectedProsConsModel.model).subscribe({
      next: (data) => {
        this.selectedProduct = data.product;
        this.prosConsCost = data.cost;
        this.prosList = this.selectedProduct!.pros || [];
        this.consList = this.selectedProduct!.cons || [];
        this.notificationService.showSuccess('Success', 'Pros & Cons generated successfully');
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to generate pros & cons');
        this.loading = false;
      }
    });
  }

  // Actualizare produs
  updateProduct(): void {
    if (!this.selectedProduct) return;

    this.loading = true;
    this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct, false).subscribe({
      next: () => {
        this.notificationService.showSuccess('Success', 'Product updated successfully');
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'Failed to update product');
        this.loading = false;
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
}
