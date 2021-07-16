import {TestBed} from '@angular/core/testing';
import {ShopifyCarrierService} from '@nusantara/services/shopify/shopify-carrier.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('ShopifyCarrierService', () => {
  let service: ShopifyCarrierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(ShopifyCarrierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
