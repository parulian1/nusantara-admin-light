import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyWebhookComponent } from './shopify-webhook.component';

describe('ShopifyWebhookComponent', () => {
  let component: ShopifyWebhookComponent;
  let fixture: ComponentFixture<ShopifyWebhookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopifyWebhookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyWebhookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
