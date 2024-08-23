import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product/product';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';

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

  constructor(
    private productService: ProductService,
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
    this.uploadToWordPress = false;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.editDialog = true;
    this.submitted = false;
    this.uploadToWordPress = false; 
  }

  viewProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.viewDialog = true;
  }

  saveProduct() {
    this.submitted = true;
    if (this.isValidProduct(this.product)) {
        this.loading = true; 
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
    if (this.isValidProduct(this.product)) {
        this.loading = true; 
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

  private isValidProduct(product: Product): boolean {
    return !!product.name && 
           product.store_ids.length > 0 && 
           product.affiliate_urls.length > 0 && 
           !!product.rating;
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
}
