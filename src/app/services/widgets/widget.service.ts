import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(private httpService: HttpService) {}

  generateProductWidget(blogId: number, productId: number): Observable<any> {
    const url = `/${blogId}/widgets/generate/product?product_id=${productId}`;
    return this.httpService.post<any>(url, {});
  }

  generateArticleWidget(blogId: number, articleId: number, publishToWP: boolean): Observable<any> {
    const url = `/${blogId}/widgets/generate/article?article_id=${articleId}&publish_to_wp=${publishToWP}`;
    return this.httpService.post<any>(url, {});
  }
}
