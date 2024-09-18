import { TestBed } from '@angular/core/testing';

import { StockCheckLogService } from './stock-check-log.service';

describe('StockCheckLogService', () => {
  let service: StockCheckLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockCheckLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
