import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WordpressService {

  private endpoint = 'wordpress/';

  constructor(private httpService: HttpService) {}

  getUsers(): Observable<any[]> {
    return this.httpService.get<any[]>(`${this.endpoint}users`);
  }

  getCategories(): Observable<any[]> {
    return this.httpService.get<any[]>(`${this.endpoint}categories`);
  }
}

