import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Blog } from '../../models/blog/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private endpoint = 'blogs/';

  constructor(private httpService: HttpService) {}

  /**
   * Retrieves a list of blogs with pagination and optional filtering.
   * 
   * @param skip The number of records to skip (for pagination).
   * @param limit The max number of records to return (for pagination).
   * @param filter Optional string to filter blogs (by name, base_url, username).
   * @returns An Observable containing an object with 'blogs' array and 'total_records'.
   */
  getBlogs(skip: number = 0, limit: number = 10, filter?: string): Observable<{ blogs: Blog[], total_records: number }> {
    let queryParams = `?skip=${skip}&limit=${limit}`;
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
    return this.httpService.get<{ blogs: Blog[], total_records: number }>(`${this.endpoint}${queryParams}`);
  }

  /**
   * Retrieves a single blog by its ID.
   * 
   * @param id The ID of the blog to retrieve.
   * @returns An Observable of the Blog object.
   */
  getBlogById(id: number): Observable<Blog> {
    return this.httpService.get<Blog>(`${this.endpoint}${id}`);
  }

  /**
   * Creates a new blog in the system.
   * 
   * @param blogData The data for the new blog.
   * @returns An Observable of the created Blog object.
   */
  createBlog(blogData: Omit<Blog, 'id'>): Observable<Blog> {
    return this.httpService.post<Blog>(`${this.endpoint}`, blogData);
  }

  /**
   * Updates an existing blog.
   * 
   * @param id The ID of the blog to update.
   * @param blogData Partial (or full) blog data to update.
   * @returns An Observable of the updated Blog object.
   */
  updateBlog(id: number, blogData: Partial<Blog>): Observable<Blog> {
    return this.httpService.put<Blog>(`${this.endpoint}${id}`, blogData);
  }

  /**
   * Deletes a blog by its ID.
   * 
   * @param id The ID of the blog to delete.
   * @returns An Observable of the deleted Blog object.
   */
  deleteBlog(id: number): Observable<Blog> {
    return this.httpService.delete<Blog>(`${this.endpoint}${id}`);
  }
}
