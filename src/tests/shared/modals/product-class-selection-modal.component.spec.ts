import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClassSelectionModalComponent } from '@nusantara/shared/modals/product-class-selection-modal.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSmartModalModule} from 'ngx-smart-modal';

describe('ProductClassSelectionModalComponent', () => {
  let component: ProductClassSelectionModalComponent;
  let fixture: ComponentFixture<ProductClassSelectionModalComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgxSmartModalModule.forChild()
      ],
      declarations: [ ProductClassSelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(ProductClassSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });
});
