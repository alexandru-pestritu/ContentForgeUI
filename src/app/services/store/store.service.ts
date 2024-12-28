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

  constructor(private httpService: HttpService) {}

  getStores(
    blogId: number,
    skip: number = 0,
    limit: number = 10,
    sortField?: string,
    sortOrder?: number,
    filter?: string
  ): Observable<{ stores: Store[], total_records: number }> {
    let endpoint = `/${blogId}/stores`;
    let queryParams = `?skip=${skip}&limit=${limit}`;
    
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }

    return this.httpService.get<{ stores: Store[], total_records: number }>(endpoint + queryParams);
  }

  getStoreById(blogId: number, storeId: number): Observable<Store> {
    const endpoint = `/${blogId}/stores/${storeId}`;
    return this.httpService.get<Store>(endpoint);
  }

  createStore(blogId: number, store: StoreCreateDTO, uploadToWordPress: boolean): Observable<Store> {
    const endpoint = `/${blogId}/stores?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.post<Store>(endpoint, store);
  }

  updateStore(blogId: number, storeId: number, storeUpdate: StoreUpdateDTO, uploadToWordPress: boolean): Observable<Store> {
    const endpoint = `/${blogId}/stores/${storeId}?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.put<Store>(endpoint, storeUpdate);
  }

  deleteStore(blogId: number, storeId: number): Observable<Store> {
    const endpoint = `/${blogId}/stores/${storeId}`;
    return this.httpService.delete<Store>(endpoint);
  }
}
