import { TestBed } from '@angular/core/testing';

import { ShopifyCarrierResolver } from './shopify-carrier.resolver';

describe('ShopifyCarrierResolver', () => {
  let resolver: ShopifyCarrierResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShopifyCarrierResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
