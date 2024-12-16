import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImporterService {
  private endpoint = 'import';
  constructor(private httpService: HttpService) {}

  importEntities(entityType: string, file: File): Observable<{ task_id: string, entries: any[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpService.postFormData<{task_id: string, entries: any[]}>(`${this.endpoint}/?entity_type=${entityType}`, formData);
  }

  retryImportTask(taskId: string, entityType: string): Observable<any> {
    return this.httpService.post<any>(`${this.endpoint}/${taskId}/retry?entity_type=${entityType}`, {});
  }
}
