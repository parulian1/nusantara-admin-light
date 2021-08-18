import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthModule, AuthService } from '@nusantara/auth';
import { AppComponent } from '@nusantara/app.component';
import { SharedModule } from '@nusantara/shared';
import { CoreModule } from '@nusantara/core';
import { MockJwtHelperService } from './helpers/mocks';
import {Router} from '@angular/router';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AuthModule,
        SharedModule,
        CoreModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: JwtHelperService, useClass: MockJwtHelperService },
        // { provide: Router, use: router}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'shouldRefresh', 'refresh']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
