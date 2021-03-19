import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MainWrapperComponent } from '@nusantara/view-wrappers/main-wrapper.component';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';

describe('MainWrapperComponent', () => {
  let component: MainWrapperComponent;
  let fixture: ComponentFixture<MainWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, JwtModule ],
      declarations: [ MainWrapperComponent ],
      providers: [JwtHelperService, ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
