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

  getStores(skip: number = 0, limit: number = 10): Observable<{ stores: Store[], total_records: number }> {
    return this.httpService.get<{ stores: Store[], total_records: number }>(`${this.endpoint}?skip=${skip}&limit=${limit}`);
  }

  getStoreById(id: number): Observable<Store> {
    return this.httpService.get<Store>(`${this.endpoint}${id}`);
  }

  createStore(store: StoreCreateDTO, uploadToWordPress: boolean): Observable<Store> {
    const url = `${this.endpoint}?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.post<Store>(url, store);
  }

  updateStore(id: number, store: StoreUpdateDTO, uploadToWordPress: boolean): Observable<Store> {
    const url = `${this.endpoint}${id}?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.put<Store>(url, store);
  }

  deleteStore(id: number): Observable<Store> {
    return this.httpService.delete<Store>(`${this.endpoint}${id}`);
  }
}
