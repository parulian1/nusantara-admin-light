import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnonWrapperComponent } from '@nusantara/view-wrappers/anon-wrapper.component';
import { AuthModule } from '@nusantara/auth';
import { RouterTestingModule } from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('AnonWrapperComponent', () => {
  let component: AnonWrapperComponent;
  let fixture: ComponentFixture<AnonWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModule, RouterTestingModule, ],
      declarations: [ AnonWrapperComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
