import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { WarehouseLocationModalComponent } from './warehouse-location-modal.component';

describe('WarehouseLocationModalComponent', () => {
  let component: WarehouseLocationModalComponent;
  let fixture: ComponentFixture<WarehouseLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ WarehouseLocationModalComponent ],
      providers: [
        FormBuilder
      ],
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
