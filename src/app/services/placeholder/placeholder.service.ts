import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceholderService {

  private endpoint = 'placeholders';

  constructor(private httpService : HttpService) { }

  getPlaceholdersByType(type: string): Observable<string[]> {
    return this.httpService.get<string[]>(`${this.endpoint}/${type}`);
  }
}
