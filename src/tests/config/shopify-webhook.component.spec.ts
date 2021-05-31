import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ShopifyWebhookComponent} from '@nusantara/pages/config/shopify/shopify-webhook.component';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ShopifyWebhookService} from '@nusantara/services/shopify/shopify-webhook.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';


describe('ShopifyWebhookComponent', () => {
  let component: ShopifyWebhookComponent;
  let fixture: ComponentFixture<ShopifyWebhookComponent>;
  let shopifyWebhookService: jasmine.SpyObj<ShopifyWebhookService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ],
      declarations: [ ShopifyWebhookComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({

            })
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyWebhookComponent);
    component = fixture.componentInstance;
    shopifyWebhookService = TestBed.inject(ShopifyWebhookService) as jasmine.SpyObj<ShopifyWebhookService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
