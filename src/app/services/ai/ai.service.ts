import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  
  private endpoint = 'ai/';

  constructor(private httpService: HttpService) {}

  getProviders(featureName: string, subfeatureName: string): Observable<any> {
    const url = `${this.endpoint}providers?feature=${featureName}&subfeature=${subfeatureName}`;
    return this.httpService.get<any>(url);
  }

  generateProductText(productId: number, promptId: number, provider: string, model: string): Observable<any> {
    const url = `${this.endpoint}generate-product-text?product_id=${productId}&prompt_id=${promptId}&provider=${provider}&model=${model}`;
    return this.httpService.post<any>(url, {});
  }

  generateArticleText(articleId: number, promptId: number, provider: string, model: string): Observable<any> {
    const url = `${this.endpoint}generate-article-text?article_id=${articleId}&prompt_id=${promptId}&provider=${provider}&model=${model}`;
    return this.httpService.post<any>(url, {});
  }
}
