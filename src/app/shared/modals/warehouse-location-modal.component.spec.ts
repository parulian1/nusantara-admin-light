import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseLocationModalComponent } from './warehouse-location-modal.component';

describe('WarehouseLocationModalComponent', () => {
  let component: WarehouseLocationModalComponent;
  let fixture: ComponentFixture<WarehouseLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseLocationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
