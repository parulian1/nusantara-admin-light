import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgxWmsComponent } from './kgx-wms.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('KgxWmsComponent', () => {
  let component: KgxWmsComponent;
  let fixture: ComponentFixture<KgxWmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      declarations: [ KgxWmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KgxWmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
