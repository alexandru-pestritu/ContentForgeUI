import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { DashboardStats } from '../../models/dashboard/dashboard-stats';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private httpService: HttpService) {}

  getDashboardStats(blogId: number): Observable<DashboardStats> {
    const url = `${blogId}/dashboard/stats`;
    return this.httpService.get<DashboardStats>(url);
  }
}
