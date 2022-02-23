import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePriceComponent } from './advance-price.component';

describe('AdvancePriceComponent', () => {
  let component: AdvancePriceComponent;
  let fixture: ComponentFixture<AdvancePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePriceComponent ]
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
