import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WordpressService {

  constructor(private httpService: HttpService) {}

  getUsers(blogId: number): Observable<any[]> {
    const url = `/${blogId}/wordpress/users`;
    return this.httpService.get<any[]>(url);
  }

  getCategories(blogId: number): Observable<any[]> {
    const url = `/${blogId}/wordpress/categories`;
    return this.httpService.get<any[]>(url);
  }
}

