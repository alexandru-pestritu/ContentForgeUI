import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Product } from '../../models/product/product';
import { ProductCreateDTO } from '../../models/product/product-create-dto';
import { ProductUpdateDTO } from '../../models/product/product-update-dto';
import { Article } from '../../models/article/article';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpService: HttpService) {}

  getProducts(
    blogId: number,
    skip: number = 0,
    limit: number = 10,
    sortField?: string,
    sortOrder?: number,
    filter?: string
  ): Observable<{ products: Product[], total_records: number }> {
    let endpoint = `${blogId}/products/`;
    let queryParams = `?skip=${skip}&limit=${limit}`;

    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }

    return this.httpService.get<{ products: Product[], total_records: number }>(endpoint + queryParams);
  }

  getProductById(blogId: number, id: number): Observable<Product> {
    const endpoint = `${blogId}/products/${id}`;
    return this.httpService.get<Product>(endpoint);
  }

  createProduct(blogId: number, product: ProductCreateDTO, uploadToWordPress: boolean): Observable<Product> {
    const endpoint = `${blogId}/products/?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.post<Product>(endpoint, product);
  }

  updateProduct(blogId: number, id: number, product: ProductUpdateDTO, uploadToWordPress: boolean): Observable<Product> {
    const endpoint = `${blogId}/products/${id}?upload_to_wordpress=${uploadToWordPress}`;
    return this.httpService.put<Product>(endpoint, product);
  }

  deleteProduct(blogId: number, id: number): Observable<Product> {
    const endpoint = `${blogId}/products/${id}`;
    return this.httpService.delete<Product>(endpoint);
  }

  getOutOfStockProducts(blogId: number): Observable<{ product: Product, articles: Article[] }[]> {
    const endpoint = `${blogId}/products/out-of-stock`;
    return this.httpService.get<{ product: Product, articles: Article[] }[]>(endpoint);
  }
}

