import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { StockCheckLog } from '../../models/stock-check-log/stock-check-log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockCheckLogService {
  constructor(private httpService: HttpService) {}

  getStockCheckLogs(blogId: number, startDate?: string, endDate?: string): Observable<StockCheckLog[]> {
    let endpoint = `${blogId}/stock-check-logs/`;

    let queryParams = '';
    if (startDate) {
      queryParams += `?start_date=${startDate}`;
    }
    if (endDate) {
      queryParams += startDate ? `&end_date=${endDate}` : `?end_date=${endDate}`;
    }

    return this.httpService.get<StockCheckLog[]>(endpoint + queryParams);
  }
}
