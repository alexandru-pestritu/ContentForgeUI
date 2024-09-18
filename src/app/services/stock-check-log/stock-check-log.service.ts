import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { StockCheckLog } from '../../models/stock-check-log/stock-check-log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockCheckLogService {
  private endpoint = 'stock-check-logs/';

  constructor(private httpService: HttpService) {}

  getStockCheckLogs(startDate?: string, endDate?: string): Observable<StockCheckLog[]> {
    let queryParams = '';

    if (startDate) {
      queryParams += `?start_date=${startDate}`;
    }
    if (endDate) {
      queryParams += startDate ? `&end_date=${endDate}` : `?end_date=${endDate}`;
    }

    return this.httpService.get<StockCheckLog[]>(`${this.endpoint}${queryParams}`);
  }
}
