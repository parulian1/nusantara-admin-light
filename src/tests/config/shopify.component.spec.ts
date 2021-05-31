import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ShopifyComponent} from '@nusantara/pages/config/shopify/shopify.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';


describe('ShopifyComponent', () => {
  let component: ShopifyComponent;
  let fixture: ComponentFixture<ShopifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopifyComponent ],
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
    fixture = TestBed.createComponent(ShopifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
