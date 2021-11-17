import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMappingComponent } from './warehouse-mapping.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '@nusantara/shared';

describe('WarehouseMappingComponent', () => {
  let component: WarehouseMappingComponent;
  let fixture: ComponentFixture<WarehouseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
      ],
      declarations: [ WarehouseMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
