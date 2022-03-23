import { TestBed } from '@angular/core/testing';

import { CatalogueService } from '@nusantara/services/catalogue.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CatalogueService', () => {
  let service: CatalogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CatalogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
