import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ShopifyHubComponent} from '@nusantara/pages/config/shopify/shopify-hub.component';

describe('ShopifyHubComponent', () => {
  let component: ShopifyHubComponent;
  let fixture: ComponentFixture<ShopifyHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopifyHubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
