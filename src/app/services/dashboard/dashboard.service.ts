import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { DashboardStats } from '../../models/dashboard/dashboard-stats';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private endpoint = 'dashboard/';

  constructor(private httpService: HttpService) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.httpService.get<DashboardStats>(`${this.endpoint}stats`);
  }
}
