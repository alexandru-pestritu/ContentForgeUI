import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  private endpoint = 'widgets/generate/';

  constructor(private httpService: HttpService) {}

  generateProductWidget(productId: number): Observable<any> {
    const url = `${this.endpoint}product?product_id=${productId}`;
    return this.httpService.post<any>(url, {});
  }

  
  generateArticleWidget(articleId: number, publishToWP: boolean): Observable<any> {
    const url = `${this.endpoint}article?article_id=${articleId}&publish_to_wp=${publishToWP}`;
    return this.httpService.post<any>(url, {});
  }
}
