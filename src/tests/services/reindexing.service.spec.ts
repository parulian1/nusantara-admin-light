import { TestBed } from '@angular/core/testing';
import {ReindexingService} from '@nusantara/pages/config/reindexing/reindexing.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('ReindexingService', () => {
  let service: ReindexingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(ReindexingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
