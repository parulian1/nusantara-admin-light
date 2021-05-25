import { TestBed } from '@angular/core/testing';

import { ShopifyCarrierService } from './shopify-carrier.service';

describe('ShopifyCarrierService', () => {
  let service: ShopifyCarrierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopifyCarrierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
