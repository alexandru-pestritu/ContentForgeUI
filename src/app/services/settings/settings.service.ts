import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Setting } from '../../models/settings/setting';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private endpoint = 'settings/';

  constructor(private httpService : HttpService) { }

  getSettings(): Observable<Setting[]> {
    return this.httpService.get<Setting[]>(this.endpoint);
  }

  getSetting(key: string): Observable<Setting> {
    return this.httpService.get<Setting>(`${this.endpoint}${key}`);
  }

  createSetting(setting: Partial<Setting>): Observable<Setting> {
    return this.httpService.post<Setting>(this.endpoint, setting);
  }


  updateSetting(key: string, setting: Partial<Setting>): Observable<Setting> {
    return this.httpService.put<Setting>(`${this.endpoint}${key}`, setting);
  }

  deleteSetting(key: string): Observable<Setting> {
    return this.httpService.delete<Setting>(`${this.endpoint}${key}`);
  }
}
