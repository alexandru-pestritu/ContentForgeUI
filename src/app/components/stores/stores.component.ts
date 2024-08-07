import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { Store } from '../../models/store/store';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit {

  stores: Store[] = [];

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getStores().subscribe({
      next: (data) => {
        this.stores = data;
      },
      error: (err) => {
        console.error('Error fetching stores', err);
      }
    });
  }

}
