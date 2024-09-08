import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { Store } from '../../models/store/store';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  stores: Store[] = [];
  totalRecords: number = 0;
  rows: number = 10; 
  storeDialog: boolean = false;
  store: Store = {} as Store;
  selectedStores: Store[] = [];
  submitted: boolean = false;
  uploadToWordPress: boolean = false;
  loading: boolean = false;

  constructor(
    private storeService: StoreService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
  }

  loadStores(skip: number, limit: number, sortField?: string, sortOrder?: number, filter?: string): void {
    this.storeService.getStores(skip, limit, sortField, sortOrder, filter).subscribe({
      next: (data) => {
        this.stores = data.stores;
        this.totalRecords = data.total_records;
      },
      error: (err) => {
        console.error('Error fetching stores', err);
        this.notificationService.showError('Error', 'Failed to load stores.');
      }
    });
  }

  loadStoresLazy(event: TableLazyLoadEvent): void {
    const skip = event.first || 0;
    const limit = event.rows !== null && event.rows !== undefined ? event.rows : this.rows;
    
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField || undefined;
    const sortOrder = event.sortOrder || undefined;
    const globalFilter = Array.isArray(event.globalFilter) ? event.globalFilter[0] : event.globalFilter || undefined;

    this.loadStores(skip, limit, sortField, sortOrder, globalFilter);
  }

  openNewStore() {
    this.store = {} as Store;
    this.uploadToWordPress = false;
    this.submitted = false;
    this.storeDialog = true;
  }

  hideDialog() {
    this.storeDialog = false;
    this.submitted = false;
  }

  saveStore() {
    this.submitted = true;
    
    if (this.store.name && this.store.base_url) {
      this.loading = true; 
      this.submitted = false;
      if (this.store.id) {
        this.storeService.updateStore(this.store.id, this.store, this.uploadToWordPress).subscribe({
          next: () => {
            this.notificationService.showSuccess('Success', 'Store updated successfully.');
            this.loadStores(0, this.rows);
            this.loading = false; 
            this.storeDialog = false;
          },
          error: () => {
            this.notificationService.showError('Error', 'Failed to update store.');
            this.loading = false; 
          }
        });
      } else {
        this.storeService.createStore(this.store, this.uploadToWordPress).subscribe({
          next: () => {
            this.notificationService.showSuccess('Success', 'Store created successfully.');
            this.loadStores(0, this.rows);
            this.loading = false; 
            this.storeDialog = false;
          },
          error: () => {
            this.notificationService.showError('Error', 'Failed to create store.');
            this.loading = false; 
          }
        });
      }
      this.store = {} as Store;
    }
  }

  editStore(store: Store) {
    this.store = { ...store };
    this.uploadToWordPress = false;
    this.storeDialog = true;
  }

  deleteStore(store: Store): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${store.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeService.deleteStore(store.id).subscribe({
          next: () => {
            this.stores = this.stores.filter(s => s.id !== store.id);
            this.notificationService.showSuccess('Success', `Store ${store.name} deleted successfully.`);
          },
          error: (err) => {
            console.error('Error deleting store', err);
            this.notificationService.showError('Error', `Failed to delete store ${store.name}.`);
          }
        });
      }
    });
  }

  deleteSelectedStores(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected stores?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = this.selectedStores.map(store => store.id);
        selectedIds.forEach(id => {
          this.storeService.deleteStore(id).subscribe({
            next: () => {
              this.stores = this.stores.filter(s => s.id !== id);
            },
            error: (err) => {
              console.error('Error deleting store', err);
              this.notificationService.showError('Error', 'Failed to delete some stores.');
            }
          });
        });
        this.notificationService.showSuccess('Success', 'Selected stores deleted successfully.');
        this.selectedStores = []; 
      }
    });
  }

  onGlobalFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(target.value, 'contains');
    }
  }
}