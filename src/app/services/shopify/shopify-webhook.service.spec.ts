import { TestBed } from '@angular/core/testing';

import { ShopifyWebhookService } from './shopify-webhook.service';

describe('ShopifyWebhookService', () => {
  let service: ShopifyWebhookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopifyWebhookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
