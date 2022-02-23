import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePriceComponent } from '@nusantara/pages/catalog/product/advance-price/advance-price.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('AdvancePriceComponent', () => {
  let component: AdvancePriceComponent;
  let fixture: ComponentFixture<AdvancePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePriceComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
