import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Article } from '../../models/article/article';
import { Observable } from 'rxjs';
import { ArticleCreateDTO } from '../../models/article/article-create-dto';
import { ArticleUpdateDTO } from '../../models/article/article-update-dto';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private endpoint = 'articles/';

  constructor(private httpService: HttpService) {}

  getArticles(skip: number = 0, limit: number = 10, sortField?: string, sortOrder?: number, filter?: string): Observable<{ articles: Article[], total_records: number }> {
    let queryParams = `?skip=${skip}&limit=${limit}`;
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
    return this.httpService.get<{ articles: Article[], total_records: number }>(`${this.endpoint}${queryParams}`);
  }

  getArticleById(id: number): Observable<Article> {
    return this.httpService.get<Article>(`${this.endpoint}${id}`);
  }

  createArticle(article: ArticleCreateDTO, uploadToWordPress: boolean = false): Observable<Article> {
    return this.httpService.post<Article>(`${this.endpoint}?upload_to_wordpress=${uploadToWordPress}`, article);
  }

  updateArticle(id: number, article: ArticleUpdateDTO, uploadToWordPress: boolean = false): Observable<Article> {
    return this.httpService.put<Article>(`${this.endpoint}${id}?upload_to_wordpress=${uploadToWordPress}`, article);
  }

  deleteArticle(id: number): Observable<Article> {
    return this.httpService.delete<Article>(`${this.endpoint}${id}`);
  }

  getLatestArticles(limit: number = 5): Observable<Article[]> {
    return this.httpService.get<Article[]>(`${this.endpoint}latest?limit=${limit}`);
  }

  exportArticles(skip: number = 0, limit: number = 10, sortField?: string, sortOrder?: number, filter?: string): Observable<Blob> {
    let queryParams = `?skip=${skip}&limit=${limit}`;
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
  
    return this.httpService.getCSVBlob(`${this.endpoint}export${queryParams}`);
  }
}
