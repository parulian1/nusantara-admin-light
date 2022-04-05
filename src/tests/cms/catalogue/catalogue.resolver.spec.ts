import { TestBed } from '@angular/core/testing';

import { CatalogueResolver } from '@nusantara/resolvers/catalogue/catalogue.resolver';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('CatalogueResolver', () => {
  let resolver: CatalogueResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    });
    resolver = TestBed.inject(CatalogueResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
