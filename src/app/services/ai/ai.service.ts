import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  
  constructor(private httpService: HttpService) {}

  getProviders(blogId: number, featureName: string, subfeatureName: string): Observable<any> {
    const url = `${blogId}/ai/providers?feature=${featureName}&subfeature=${subfeatureName}`;
    return this.httpService.get<any>(url);
  }

  generateProductText(blogId: number, productId: number, promptId: number, provider: string, model: string): Observable<any> {
    const url = `${blogId}/ai/generate-product-text/?product_id=${productId}&prompt_id=${promptId}&provider=${provider}&model=${model}`;
    return this.httpService.post<any>(url, {});
  }

  generateArticleText(blogId: number, articleId: number, promptId: number, provider: string, model: string): Observable<any> {
    const url = `${blogId}/ai/generate-article-text/?article_id=${articleId}&prompt_id=${promptId}&provider=${provider}&model=${model}`;
    return this.httpService.post<any>(url, {});
  }
}
