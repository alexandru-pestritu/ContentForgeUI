import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { Store } from '../../models/store/store';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit {

  stores: Store[] = [];

  constructor(
    private storeService: StoreService,
    private notificationService: NotificationService) {}

    ngOnInit(): void {
      this.storeService.getStores().subscribe({
        next: (data) => {
          this.stores = data;
        },
        error: (err) => {
          console.error('Error fetching stores', err);
          this.notificationService.showError('Error', 'Failed to load stores.');
        }
      });
    }

}
