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

  private endpoint = 'products/'; 

  constructor(private httpService: HttpService) {}

  getProducts(skip: number = 0, limit: number = 10, sortField?: string, sortOrder?: number, filter?: string): Observable<{ products: Product[], total_records: number }> {
    let queryParams = `?skip=${skip}&limit=${limit}`;
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
    return this.httpService.get<{ products: Product[], total_records: number }>(`${this.endpoint}${queryParams}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.httpService.get<Product>(`${this.endpoint}${id}`);
  }

  createProduct(product: ProductCreateDTO, uploadToWordPress: boolean): Observable<Product> {
    return this.httpService.post<Product>(`${this.endpoint}?upload_to_wordpress=${uploadToWordPress}`, product);
  }

  updateProduct(id: number, product: ProductUpdateDTO, uploadToWordPress: boolean): Observable<Product> {
    return this.httpService.put<Product>(`${this.endpoint}${id}?upload_to_wordpress=${uploadToWordPress}`, product);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.httpService.delete<Product>(`${this.endpoint}${id}`);
  }

  getOutOfStockProducts(): Observable<{ product: Product, articles: Article[] }[]> {
    return this.httpService.get<{ product: Product, articles: Article[] }[]>(`${this.endpoint}out-of-stock`);
  }
}
