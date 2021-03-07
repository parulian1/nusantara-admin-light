import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyMessageListComponent } from './shopify-message-list.component';

describe('ShopifyMessageListComponent', () => {
  let component: ShopifyMessageListComponent;
  let fixture: ComponentFixture<ShopifyMessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopifyMessageListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
