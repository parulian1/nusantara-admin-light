import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClassSelectionModalComponent } from '@nusantara/shared/modals/product-class-selection-modal.component';

describe('ProductClassSelectionModalComponent', () => {
  let component: ProductClassSelectionModalComponent;
  let fixture: ComponentFixture<ProductClassSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductClassSelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductClassSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
