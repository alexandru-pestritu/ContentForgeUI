import { TestBed } from '@angular/core/testing';

import { BlogContextService } from './blog-context.service';

describe('BlogContextService', () => {
  let service: BlogContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
