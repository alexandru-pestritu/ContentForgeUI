import { TestBed } from '@angular/core/testing';

import { WebsocketImportService } from './websocket-import.service';

describe('WebsocketImportService', () => {
  let service: WebsocketImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
