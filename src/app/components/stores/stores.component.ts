import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { Store } from '../../models/store/store';
import { NotificationService } from '../../services/notification/notification.service';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit {

  stores: Store[] = [];
  totalRecords: number = 0;
  rows: number = 10; 

  constructor(
    private storeService: StoreService,
    private notificationService: NotificationService) {}

  ngOnInit(): void {
    //this.loadStores(0, this.rows);
  }

  loadStores(skip: number, limit: number): void {
    this.storeService.getStores(skip, limit).subscribe({
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
    this.loadStores(skip, limit); 
  }

}
