import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {MainWrapperComponent} from '@nusantara/view-wrappers/main-wrapper.component';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import {RouterTestingModule} from '@angular/router/testing';
import {GetUserDisplayNamePipe} from '@nusantara/shared/get-user-display-name.pipe';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from '@nusantara/auth';

describe('MainWrapperComponent', () => {
  let component: MainWrapperComponent;
  let fixture: ComponentFixture<MainWrapperComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE2NDgzNjgzLCJqdGkiOiJhN2Y0MzNjYTcwMWY0Zjk2OGU5MjNjN2NjYTc4ZTk2NSIsInVzZXJfaWQiOiJhZG1pbmRlbW8tMiIsImlzX3N0YWZmIjp0cnVlLCJmaXJzdF9uYW1lIjoiIiwibGFzdF9uYW1lIjoiIiwiZW1haWwiOiJhZG1pbi5kZW1vQGdyYW1lZGlhLmRpZ2l0YWwiLCJjYW5fdXNlX3BvcyI6ZmFsc2UsImlkZW50aXR5X251bWJlciI6bnVsbCwic2l0ZSI6ImRlbW8tcmIuYmhpc21hLmNsb3VkIiwiaXNfcmVzZWxsZXIiOnRydWUsImdyb3VwcyI6W10sImlzcyI6Im51c2FudGFyYV9hZG1pbiJ9.Z_om_UKz-mSZjvmV4z6gEcxOikPiQHt9F3uRf-sik_0',
            authScheme: 'Bearer ',
            allowedDomains: [
              new RegExp('.+')
            ],
            disallowedRoutes: [
              'localhost:8080/api/iam/login/',
              'localhost:8080/api/iam/reset-password/',
            ]
          }
        }),
      ],
      declarations: [MainWrapperComponent, GetUserDisplayNamePipe],
      providers: [
        JwtHelperService,
        {
          provide: AuthService,
          useValue: authServiceSpy
        }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWrapperComponent);
    component = fixture.componentInstance;
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'shouldRefresh'], ['siteDomain']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
