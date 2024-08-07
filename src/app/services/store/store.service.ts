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

  getStores(): Observable<Store[]> {
    return this.httpService.get<Store[]>(this.endpoint);
  }

  getStoreById(id: number): Observable<Store> {
    return this.httpService.get<Store>(`${this.endpoint}/${id}`);
  }

  createStore(store: StoreCreateDTO): Observable<Store> {
    return this.httpService.post<Store>(this.endpoint, store);
  }

  updateStore(id: number, store: StoreUpdateDTO): Observable<Store> {
    return this.httpService.put<Store>(`${this.endpoint}/${id}`, store);
  }

  deleteStore(id: number): Observable<Store> {
    return this.httpService.delete<Store>(`${this.endpoint}/${id}`);
  }
}
