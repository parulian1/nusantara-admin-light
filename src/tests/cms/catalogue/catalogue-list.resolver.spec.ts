import { TestBed } from '@angular/core/testing';

import { CatalogueListResolver } from '@nusantara/resolvers/catalogue/catalogue-list.resolver';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CatalogueListResolverResolver', () => {
  let resolver: CatalogueListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,]
    });
    resolver = TestBed.inject(CatalogueListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
