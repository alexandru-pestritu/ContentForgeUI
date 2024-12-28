import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImporterService {
  constructor(private httpService: HttpService) {}

  importEntities(blogId: number, entityType: string, file: File): Observable<{ task_id: string, entries: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${blogId}/import/?entity_type=${entityType}`;
    return this.httpService.postFormData<{task_id: string, entries: any[]}>(url, formData);
  }

  retryImportTask(blogId: number, taskId: string, entityType: string): Observable<any> {
    const url = `${blogId}/import/${taskId}/retry?entity_type=${entityType}`;
    return this.httpService.post<any>(url, {});
  }
}
