import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AppComponent } from '@nusantara/app.component';
import { AuthService } from '@nusantara/auth';
import { MockJwtHelperService } from './helpers/mocks';
import { SharedModule } from '@nusantara/shared';
import { CoreModule } from '@nusantara/core';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'shouldRefresh']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        CoreModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: JwtHelperService, useClass: MockJwtHelperService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
