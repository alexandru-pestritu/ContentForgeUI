import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Product } from '../../models/product/product';
import { ProductCreateDTO } from '../../models/product/product-create-dto';
import { ProductUpdateDTO } from '../../models/product/product-update-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private endpoint = 'products/'; 

  constructor(private httpService: HttpService) {}

  getProducts(skip: number = 0, limit: number = 10): Observable<{ products: Product[], total_records: number }> {
    return this.httpService.get<{ products: Product[], total_records: number }>(`${this.endpoint}?skip=${skip}&limit=${limit}`);
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
}
