import { TestBed } from '@angular/core/testing';

import { ReindexingService } from './reindexing.service';

describe('ReindexingService', () => {
  let service: ReindexingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReindexingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
