import { TestBed } from '@angular/core/testing';

import { ShopifyWebhookResolver } from './shopify-webhook.resolver';

describe('ShopifyWebhookResolver', () => {
  let resolver: ShopifyWebhookResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShopifyWebhookResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
