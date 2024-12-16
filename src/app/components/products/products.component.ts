import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product/product';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { StoreService } from '../../services/store/store.service';
import { forkJoin } from 'rxjs';
import { isValidUrl } from '../../services/validators/validators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  products: Product[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  selectedProducts: Product[] = [];
  product: Product = {} as Product;
  selectedProduct: Product = {} as Product;
  viewDialog: boolean = false;
  addDialog: boolean = false;
  editDialog: boolean = false;
  submitted: boolean = false;
  uploadToWordPress: boolean = false; 

  newSpecificationKey: string = '';
  newSpecificationValue: string = '';

  loading: boolean = false;

  stores: any[] = [];
  selectedStores: any[] = [];

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  loadProducts(skip: number, limit: number, sortField?: string, sortOrder?: number, filter?: string): void {
    this.productService.getProducts(skip, limit, sortField, sortOrder, filter).subscribe({
      next: (data) => {
        this.products = data.products;
        this.totalRecords = data.total_records;
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.notificationService.showError('Error', 'Failed to load products.');
      }
    });
  }

  loadProductsLazy(event: TableLazyLoadEvent): void {
    const skip = event.first || 0;
    const limit = event.rows !== null && event.rows !== undefined ? event.rows : this.rows;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField || undefined;
    const sortOrder = event.sortOrder || undefined;
    const globalFilter = Array.isArray(event.globalFilter) ? event.globalFilter[0] : event.globalFilter || undefined;

    this.loadProducts(skip, limit, sortField, sortOrder, globalFilter);
  }

  openNewProduct() {
    this.product = {} as Product;
    this.addDialog = true;
    this.submitted = false;
    this.uploadToWordPress = true;
    this.selectedStores = [];
    this.searchStores({ query: '' });
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.editDialog = true;
    this.submitted = false;
    this.uploadToWordPress = false;
    this.selectedStores = [];

    if (product.store_ids && product.store_ids.length > 0) {
        const storeObservables = product.store_ids.map(storeId => this.storeService.getStoreById(storeId));
        
        forkJoin(storeObservables).subscribe({
            next: (stores) => {
                this.selectedStores = stores.map(store => ({
                    id: store.id,
                    name: store.name,
                    displayName: `ID: ${store.id}, ${store.name}`
                }));
            },
            error: (err) => {
                console.error('Error fetching store details', err);
                this.notificationService.showError('Error', 'Failed to load store details.');
            }
        });
    }
  } 

  viewProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.viewDialog = true;

    this.selectedStores = [];

    if (product.store_ids && product.store_ids.length > 0) {
        product.store_ids.forEach((storeId) => {
            this.storeService.getStoreById(storeId).subscribe({
                next: (store) => {
                    this.selectedStores.push({
                        id: store.id,
                        name: store.name,
                        displayName: `ID: ${store.id}, ${store.name}`
                    });
                },
                error: (err) => {
                    console.error(`Error fetching details for store ID ${storeId}`, err);
                    this.notificationService.showError('Error', `Failed to load store details for ID ${storeId}.`);
                }
            });
        });
    }
}


  saveProduct() {
    this.submitted = true;
    if (this.isValidAddProduct()) {
        this.loading = true; 
        this.product.store_ids = this.selectedStores.map(store => store.id);
        this.productService.createProduct(this.product, this.uploadToWordPress).subscribe({
            next: () => {
                this.notificationService.showSuccess('Success', 'Product created successfully.');
                this.loadProducts(0, this.rows);
                this.loading = false; 
                this.addDialog = false; 
            },
            error: (err) => {
                console.error('Error creating product', err);
                this.notificationService.showError('Error', 'Failed to create product.');
                this.loading = false; 
            }
        });
    }
}

  updateProduct() {
    this.submitted = true;
    if (this.isValidEditProduct()) {
        this.loading = true; 
        this.product.store_ids = this.selectedStores.map(store => store.id);
        this.productService.updateProduct(this.product.id, this.product, this.uploadToWordPress).subscribe({
            next: () => {
                this.notificationService.showSuccess('Success', 'Product updated successfully.');
                this.loadProducts(0, this.rows);
                this.loading = false; 
                this.editDialog = false; 
            },
            error: (err) => {
                console.error('Error updating product', err);
                this.notificationService.showError('Error', 'Failed to update product.');
                this.loading = false; 
            }
        });
    }
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${product.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            this.notificationService.showSuccess('Success', `Product ${product.name} deleted successfully.`);
          },
          error: (err) => {
            console.error('Error deleting product', err);
            this.notificationService.showError('Error', `Failed to delete product ${product.name}.`);
          }
        });
      }
    });
  }

  deleteSelectedProducts(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = this.selectedProducts.map(product => product.id);
        selectedIds.forEach(id => {
          this.productService.deleteProduct(id).subscribe({
            next: () => {
              this.products = this.products.filter(p => p.id !== id);
            },
            error: (err) => {
              console.error('Error deleting product', err);
              this.notificationService.showError('Error', 'Failed to delete some products.');
            }
          });
        });
        this.notificationService.showSuccess('Success', 'Selected products deleted successfully.');
        this.selectedProducts = [];
      }
    });
  }

  hideDialog() {
    this.viewDialog = false;
    this.addDialog = false;
    this.editDialog = false;
    this.loadProducts(0, this.rows);
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }

  addSpecification() {
    if (this.newSpecificationKey && this.newSpecificationValue) {
      if (!this.product.specifications) {
        this.product.specifications = {};
      }
      this.product.specifications[this.newSpecificationKey] = this.newSpecificationValue;
      this.newSpecificationKey = '';
      this.newSpecificationValue = '';
    }
  }

  removeSpecification(key: string) {
    if (this.product.specifications) {
      delete this.product.specifications[key];
    }
  }

  objectKeys = Object.keys;

  searchStores(event: any) {
    const query = event.query;
    this.storeService.getStores(0, 10, undefined, undefined, query).subscribe({
      next: (data) => {
        this.stores = data.stores.map(store => ({
          id: store.id,
          name: store.name,
          displayName: `ID: ${store.id}, ${store.name}`
        }));
        
        if (this.stores.length > 0 && this.selectedStores.length === 0) {
          this.selectedStores.push(this.stores[0]);
        }
      },
      error: (err) => {
        console.error('Error fetching stores', err);
        this.notificationService.showError('Error', 'Failed to fetch stores.');
      }
    });
  }
  

  isValidUrl(url: string): boolean {
    return isValidUrl(url);
  }

  isAffiliateUrlsValid(): boolean {
    return this.product.affiliate_urls && this.product.affiliate_urls.every(url => this.isValidUrl(url));
  }
  
  isImageUrlsValid(): boolean {
    return this.product.image_urls! && this.product.image_urls!.every(url => this.isValidUrl(url));
  }

  isValidAddProduct(): boolean {
    if (!this.product.name) return false;
    if (this.selectedStores.length === 0) return false;
    if (this.product.affiliate_urls.length === 0) return false;
    if (!this.product.seo_keyword) return false;
    if (!this.product.rating) return false;
    if (!this.isAffiliateUrlsValid()) return false;
  
    return true;
  }

  isValidEditProduct(): boolean {
    if(!this.isValidAddProduct()) return false;
  
    if (!this.product.full_name) return false;
    if (!this.product.description) return false;
    if (!this.product.specifications || Object.keys(this.product.specifications).length === 0) return false;
    if (this.product.image_urls?.length === 0) return false;
    if (!this.isImageUrlsValid()) return false;
  
    return true;
  }
  
  exportProducts(): void {
    const sortField = this.dt?.sortField || undefined;
    const sortOrder = this.dt?.sortOrder || undefined;
    const globalFilter = Array.isArray(this.dt?.filters?.['global'])
    ? this.dt?.filters?.['global']?.[0]?.value
    : this.dt?.filters?.['global']?.value || undefined;

    const skip = this.dt?.first || 0;
    const limit = this.dt?.rows || this.rows;
    
    this.loading = true;
    this.productService.exportProducts(skip, limit, sortField, sortOrder, globalFilter).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = 'products_export.csv';
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error exporting products', err);
        this.notificationService.showError('Error', 'Failed to export products.');
        this.loading = false;
      }
    });
  }
  
  handleImportDialogClosed() {
    this.loadProducts(0, this.rows);
  }
}

