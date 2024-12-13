import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Store } from '../../models/store/store';
import { Observable } from 'rxjs';
import { StoreCreateDTO } from '../../models/store/store-create-dto';
import { StoreUpdateDTO } from '../../models/store/store-update-dto';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private endpoint = 'stores/'; 

  constructor(private httpService: HttpService) {}

  getStores(skip: number = 0, limit: number = 10, sortField?: string, sortOrder?: number, filter?: string): Observable<{ stores: Store[], total_records: number }> {
    let queryParams = `?skip=${skip}&limit=${limit}`;
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
    return this.httpService.get<{ stores: Store[], total_records: number }>(`${this.endpoint}${queryParams}`);
  }
  

  getStoreById(id: number): Observable<Store> {
    return this.httpService.get<Store>(`${this.endpoint}${id}`);
  }

  createStore(store: StoreCreateDTO, uploadToWordPress: boolean): Observable<Store> {
    return this.httpService.post<Store>(`${this.endpoint}?upload_to_wordpress=${uploadToWordPress}`, store);
  }

  updateStore(id: number, store: StoreUpdateDTO, uploadToWordPress: boolean): Observable<Store> {
    return this.httpService.put<Store>(`${this.endpoint}${id}?upload_to_wordpress=${uploadToWordPress}`, store);
  }

  deleteStore(id: number): Observable<Store> {
    return this.httpService.delete<Store>(`${this.endpoint}${id}`);
  }

  exportStores(skip: number = 0, limit: number = 10, sortField?: string, sortOrder?: number, filter?: string): Observable<Blob> {
    let queryParams = `?skip=${skip}&limit=${limit}`;
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
  
    return this.httpService.getBlob(`${this.endpoint}export${queryParams}`);
  }
  
}
