import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnonWrapperComponent } from '@nusantara/view-wrappers/anon-wrapper.component';
import { AuthModule } from '@nusantara/auth';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnonWrapperComponent', () => {
  let component: AnonWrapperComponent;
  let fixture: ComponentFixture<AnonWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AuthModule, RouterTestingModule, ],
      declarations: [ AnonWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
