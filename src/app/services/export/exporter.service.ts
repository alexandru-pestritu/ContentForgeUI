import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExporterService {
  constructor(private httpService: HttpService) {}

  exportEntities(
    blogId: number,
    entityType: string,
    skip: number,
    limit: number,
    sortField?: string,
    sortOrder?: number,
    filter?: string
  ): Observable<Blob> {
    let queryParams = `?entity_type=${entityType}&skip=${skip}&limit=${limit}`;
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }

    const url = `${blogId}/export/${queryParams}`;
    return this.httpService.getCSVBlob(url);
  }
}
