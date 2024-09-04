import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Prompt } from '../../models/prompt/prompt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  private endpoint = 'prompts/'; 

  constructor(private httpService: HttpService) {}

  getPrompts(skip: number = 0, limit: number = 10, sortField?: string, sortOrder?: number, filter?: string): Observable<{ prompts: Prompt[], total_records: number }> {
    let queryParams = `?skip=${skip}&limit=${limit}`;
    if (sortField) {
      queryParams += `&sort_field=${sortField}&sort_order=${sortOrder}`;
    }
    if (filter) {
      queryParams += `&filter=${filter}`;
    }
    return this.httpService.get<{ prompts: Prompt[], total_records: number }>(`${this.endpoint}${queryParams}`);
  }
  
  getPromptById(id: number): Observable<Prompt> {
    return this.httpService.get<Prompt>(`${this.endpoint}${id}`);
  }

  createPrompt(prompt: Prompt): Observable<Prompt> {
    return this.httpService.post<Prompt>(this.endpoint, prompt);
  }

  updatePrompt(id: number, prompt: Prompt): Observable<Prompt> {
    return this.httpService.put<Prompt>(`${this.endpoint}${id}`, prompt);
  }

  deletePrompt(id: number): Observable<Prompt> {
    return this.httpService.delete<Prompt>(`${this.endpoint}${id}`);
  }

  getTypesAndSubtypes(): Observable<{ types: string[], subtypes: { [key: string]: string[] } }> {
    return this.httpService.get<{ types: string[], subtypes: { [key: string]: string[] } }>(`${this.endpoint}types-subtypes`);
  }

  getPlaceholdersByType(type: string): Observable<string[]> {
    return this.httpService.get<string[]>(`${this.endpoint}placeholders/${type}`);
  }
}
