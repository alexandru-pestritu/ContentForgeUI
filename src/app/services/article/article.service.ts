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
  constructor(private httpService: HttpService) {}

  getArticles(
    blogId: number,
    skip: number = 0,
    limit: number = 10,
    sortField?: string,
    sortOrder?: number,
    filter?: string
  ): Observable<{ articles: Article[], total_records: number }> {
    let endpoint = `${blogId}/articles/`;
    let queryParams = `?skip=${skip}&limit=${limit}`;

    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }

    return this.httpService.get<{ articles: Article[], total_records: number }>(endpoint + queryParams);
  }

  getArticleById(blogId: number, id: number): Observable<Article> {
    const url = `${blogId}/articles/${id}`;
    return this.httpService.get<Article>(url);
  }

  createArticle(blogId: number, article: ArticleCreateDTO, uploadToWordPress: boolean = false): Observable<Article> {
    const url = `${blogId}/articles/?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.post<Article>(url, article);
  }

  updateArticle(blogId: number, id: number, article: ArticleUpdateDTO, uploadToWordPress: boolean = false): Observable<Article> {
    const url = `${blogId}/articles/${id}?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.put<Article>(url, article);
  }

  deleteArticle(blogId: number, id: number): Observable<Article> {
    const url = `${blogId}/articles/${id}`;
    return this.httpService.delete<Article>(url);
  }

  getLatestArticles(blogId: number, limit: number = 5): Observable<Article[]> {
    const url = `${blogId}/articles/latest?limit=${limit}`;
    return this.httpService.get<Article[]>(url);
  }
}
