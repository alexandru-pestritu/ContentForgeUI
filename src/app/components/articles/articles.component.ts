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
import { WordpressService } from '../../services/wordpress/wordpress.service';
import { isValidUrl } from '../../services/validators/validators';

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

  users: any[] = [];
  categories: any[] = [];

  selectedAuthor: any;
  selectedCategories: any[] = [];


  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Publish', value: 'publish' }
  ];

  constructor(
    private articleService: ArticleService,
    private productService: ProductService,
    private wordpressService: WordpressService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadArticles(0, this.rows);
    this.loadWordPressUsers();
    this.loadWordPressCategories();
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

    if (article.author_id) {
        const foundAuthor = this.users.find(user => user.id === article.author_id);
        if (foundAuthor) {
            this.selectedAuthor = foundAuthor.displayName;
        } else {
            this.selectedAuthor = 'Author not found';
        }
    }

    if (article.categories_id_list && article.categories_id_list.length > 0) {
        this.selectedCategories = article.categories_id_list.map(categoryId => {
            const foundCategory = this.categories.find(category => category.id === categoryId);
            return foundCategory ? foundCategory.displayName : 'Category not found';
        });
    }
  }

  saveArticle() {
    this.submitted = true;
    if (this.isValidAddArticle()) {
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
    if (this.isValidEditArticle()) {
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
    this.productService.getProducts(0, 10, "id", -1, query).subscribe({
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

  loadWordPressUsers(): void {
    this.wordpressService.getUsers().subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          id: user.id,
          displayName: `ID: ${user.id} - ${user.name}`
        }));
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.notificationService.showError('Error', 'Failed to load WordPress users.');
      }
    });
  }
  
  loadWordPressCategories(): void {
    this.wordpressService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.map(category => ({
          id: category.id,
          displayName: `ID: ${category.id} - ${this.decodeHtml(category.name)}`
        }));
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.notificationService.showError('Error', 'Failed to load WordPress categories.');
      }
    });
  }

  private isValidArticle(article: ArticleCreateDTO | ArticleUpdateDTO): boolean {
    return !!article.title && !!article.slug && this.selectedProducts.length > 0;
  }

  isValidUrl(url: string): boolean {
    return isValidUrl(url);
  }

  isValidAddArticle(): boolean {
    if (!this.article.title) return false;
    if (!this.article.slug) return false;
    if (!this.article.author_id) return false;
    if (this.article.categories_id_list!.length === 0) return false;
    if (this.article.seo_keywords?.length === 0) return false;
    if (!this.article.meta_title) return false;
    if (!this.article.meta_description) return false;
    if (!this.article.main_image_url || !this.isValidUrl(this.article.main_image_url)) return false;
    if (!this.article.buyers_guide_image_url || !this.isValidUrl(this.article.buyers_guide_image_url)) return false;
    if (this.selectedProducts.length === 0) return false;
  
    return true;
  }  

  isValidEditArticle(): boolean {
    if(!this.isValidAddArticle()) return false;

    return true;
  }
  
  generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')   
        .replace(/\s+/g, '-');  
}

decodeHtml(encodedString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(encodedString, 'text/html');
  return doc.documentElement.textContent || encodedString;
}


}
