import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Prompt } from '../../models/prompt/prompt';
import { Observable } from 'rxjs';
import { TypesAndSubtypesResponse } from '../../models/prompt/types-and-subtypes-response';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private httpService: HttpService) {}

  getPrompts(
    blogId: number,
    skip: number = 0,
    limit: number = 10,
    sortField?: string,
    sortOrder?: number,
    filter?: string
  ): Observable<{ prompts: Prompt[], total_records: number }> {
    let endpoint = `/${blogId}/prompts`;
    let queryParams = `?skip=${skip}&limit=${limit}`;

    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
    
    return this.httpService.get<{ prompts: Prompt[], total_records: number }>(
      endpoint + queryParams
    );
  }

  getPromptById(blogId: number, id: number): Observable<Prompt> {
    const url = `/${blogId}/prompts/${id}`;
    return this.httpService.get<Prompt>(url);
  }

  createPrompt(blogId: number, prompt: Prompt): Observable<Prompt> {
    const url = `/${blogId}/prompts`;
    return this.httpService.post<Prompt>(url, prompt);
  }

  updatePrompt(blogId: number, id: number, prompt: Prompt): Observable<Prompt> {
    const url = `/${blogId}/prompts/${id}`;
    return this.httpService.put<Prompt>(url, prompt);
  }

  deletePrompt(blogId: number, id: number): Observable<Prompt> {
    const url = `/${blogId}/prompts/${id}`;
    return this.httpService.delete<Prompt>(url);
  }

  getTypesAndSubtypes(blogId: number): Observable<TypesAndSubtypesResponse> {
    const url = `/${blogId}/prompts/types-subtypes/`;
    return this.httpService.get<TypesAndSubtypesResponse>(url);
  }

  getPromptsByTypeAndOptionalSubtype(blogId: number, type: string, subtype?: string): Observable<Prompt[]> {
    let url = `/${blogId}/prompts/${type}`;
    if (subtype) {
      url += `?subtype=${subtype}`;
    }
    return this.httpService.get<Prompt[]>(url);
  }
}
