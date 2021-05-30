import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ShopifyMessageListComponent} from '@nusantara/pages/config/shopify/shopify-message-list.component';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ShopifyMessageService} from '@nusantara/services';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';


describe('ShopifyMessageListComponent', () => {
  let component: ShopifyMessageListComponent;
  let fixture: ComponentFixture<ShopifyMessageListComponent>;
  let shopifyMessageService: jasmine.SpyObj<ShopifyMessageService>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [ ShopifyMessageListComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              page: []
            })
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyMessageListComponent);
    component = fixture.componentInstance;
    shopifyMessageService =  TestBed.inject(ShopifyMessageService) as jasmine.SpyObj<ShopifyMessageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
