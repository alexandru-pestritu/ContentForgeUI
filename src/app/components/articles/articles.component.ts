import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../../services/article/article.service';
import { Article } from '../../models/article/article';
import { ArticleCreateDTO } from '../../models/article/article-create-dto';
import { ArticleUpdateDTO } from '../../models/article/article-update-dto';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product/product';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  articles: Article[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  selectedArticles: Article[] = [];
  article: Article = {} as Article;
  selectedArticle: Article = {} as Article;
  viewDialog: boolean = false;
  addDialog: boolean = false;
  editDialog: boolean = false;
  submitted: boolean = false;
  uploadToWordPress: boolean = false; 

  newFaqTitle: string = '';
  newFaqDescription: string = '';
  loading: boolean = false;

  products: any[] = []; 
  selectedProducts: any[] = [];

  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Publish', value: 'publish' }
  ];

  constructor(
    private articleService: ArticleService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadArticles(0, this.rows);
  }

  loadArticles(skip: number, limit: number, sortField?: string, sortOrder?: number, filter?: string): void {
    this.articleService.getArticles(skip, limit, sortField, sortOrder, filter).subscribe({
      next: (data) => {
        this.articles = data.articles;
        this.totalRecords = data.total_records;
      },
      error: (err) => {
        console.error('Error fetching articles', err);
        this.notificationService.showError('Error', 'Failed to load articles.');
      }
    });
  }

  loadArticlesLazy(event: TableLazyLoadEvent): void {
    const skip = event.first || 0;
    const limit = event.rows !== null && event.rows !== undefined ? event.rows : this.rows;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField || undefined;
    const sortOrder = event.sortOrder || undefined;
    const globalFilter = Array.isArray(event.globalFilter) ? event.globalFilter[0] : event.globalFilter || undefined;

    this.loadArticles(skip, limit, sortField, sortOrder, globalFilter);
  }

  openNewArticle() {
    this.article = {} as Article
    this.addDialog = true;
    this.submitted = false;
    this.uploadToWordPress = false;
    this.selectedProducts = [];
  }

  editArticle(article: Article) {
    this.article = { ...article };
    this.editDialog = true;
    this.submitted = false;
    this.uploadToWordPress = false;
    this.selectedProducts = [];

    if (article.products_id_list && article.products_id_list.length > 0) {
      const productObservables = article.products_id_list.map(productId => this.productService.getProductById(productId));
      
      forkJoin(productObservables).subscribe({
          next: (products) => {
              this.selectedProducts = products.map(product => ({
                  id: product.id,
                  name: product.name,
                  displayName: `ID: ${product.id}, ${product.name} - ${product.seo_keyword!.charAt(0).toUpperCase() + product.seo_keyword!.slice(1)}`
              }));
          },
          error: (err) => {
              console.error('Error fetching product details', err);
              this.notificationService.showError('Error', 'Failed to load product details.');
          }
      });
  }
  }

  viewArticle(article: Article) {
    this.selectedArticle = { ...article };
    this.viewDialog = true;
    this.selectedProducts = [];

    if (article.products_id_list && article.products_id_list.length > 0) {
      article.products_id_list.forEach((productId) => {
          this.productService.getProductById(productId).subscribe({
              next: (product) => {
                  this.selectedProducts.push({
                      id: product.id,
                      name: product.name,
                      displayName: `ID: ${product.id}, ${product.name} - ${product.seo_keyword!.charAt(0).toUpperCase() + product.seo_keyword!.slice(1)}`
                  });
              },
              error: (err) => {
                  console.error(`Error fetching details for product ID ${productId}`, err);
                  this.notificationService.showError('Error', `Failed to load product details for ID ${productId}.`);
              }
          });
      });
  }
  }

  saveArticle() {
    this.submitted = true;
    if (this.isValidArticle(this.article)) {
        this.loading = true; 
        this.article.products_id_list = this.selectedProducts.map(product => product.id);
        this.articleService.createArticle(this.article, this.uploadToWordPress).subscribe({
            next: () => {
                this.notificationService.showSuccess('Success', 'Article created successfully.');
                this.loadArticles(0, this.rows);
                this.loading = false; 
                this.addDialog = false; 
            },
            error: (err) => {
                console.error('Error creating article', err);
                this.notificationService.showError('Error', 'Failed to create article.');
                this.loading = false; 
            }
        });
    }
  }

  updateArticle() {
    this.submitted = true;
    if (this.isValidArticle(this.article)) {
        this.loading = true; 
        this.article.products_id_list = this.selectedProducts.map(product => product.id);
        this.articleService.updateArticle(this.article.id, this.article, this.uploadToWordPress).subscribe({
            next: () => {
                this.notificationService.showSuccess('Success', 'Article updated successfully.');
                this.loadArticles(0, this.rows);
                this.loading = false; 
                this.editDialog = false; 
            },
            error: (err) => {
                console.error('Error updating article', err);
                this.notificationService.showError('Error', 'Failed to update article.');
                this.loading = false; 
            }
        });
    }
  }

  deleteArticle(article: Article): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${article.title}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.articleService.deleteArticle(article.id).subscribe({
          next: () => {
            this.articles = this.articles.filter(a => a.id !== article.id);
            this.notificationService.showSuccess('Success', `Article ${article.title} deleted successfully.`);
          },
          error: (err) => {
            console.error('Error deleting article', err);
            this.notificationService.showError('Error', `Failed to delete article ${article.title}.`);
          }
        });
      }
    });
  }

  deleteSelectedArticles(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected articles?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = this.selectedArticles.map(article => article.id);
        selectedIds.forEach(id => {
          this.articleService.deleteArticle(id).subscribe({
            next: () => {
              this.articles = this.articles.filter(a => a.id !== id);
            },
            error: (err) => {
              console.error('Error deleting article', err);
              this.notificationService.showError('Error', 'Failed to delete some articles.');
            }
          });
        });
        this.notificationService.showSuccess('Success', 'Selected articles deleted successfully.');
        this.selectedArticles = [];
      }
    });
  }

  hideDialog() {
    this.viewDialog = false;
    this.addDialog = false;
    this.editDialog = false;
    this.loadArticles(0, this.rows);
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }

  addFaq() {
    if (this.newFaqTitle && this.newFaqDescription) {
      if (!this.article.faqs) {
        this.article.faqs = [];
      }
      this.article.faqs.push({ title: this.newFaqTitle, description: this.newFaqDescription });
      this.newFaqTitle = '';
      this.newFaqDescription = '';
    }
  }

  removeFaq(faq: { title: string; description: string }) {
    if (this.article.faqs) {
      this.article.faqs = this.article.faqs.filter(f => f !== faq);
    }
  }

  searchProducts(event: any) {
    const query = event.query;
    this.productService.getProducts(0, 10, undefined, undefined, query).subscribe({
      next: (data) => {
        this.products = data.products.map(product => ({
          id: product.id,
          name: product.name,
          displayName: `ID: ${product.id}, ${product.name} - ${product.seo_keyword!.charAt(0).toUpperCase() + product.seo_keyword!.slice(1)}`
        }));
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.notificationService.showError('Error', 'Failed to fetch products.');
      }
    });
  }

  private isValidArticle(article: ArticleCreateDTO | ArticleUpdateDTO): boolean {
    return !!article.title && !!article.slug && this.selectedProducts.length > 0;
  }
}
