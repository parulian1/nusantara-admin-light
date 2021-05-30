import { TestBed } from '@angular/core/testing';
import {ShopifyWebhookService} from '@nusantara/services/shopify/shopify-webhook.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';


describe('ShopifyWebhookService', () => {
  let service: ShopifyWebhookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(ShopifyWebhookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
