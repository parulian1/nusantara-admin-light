import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DashboardModule } from '@nusantara/pages/dashboard';
import { DashboardComponent } from '@nusantara/pages/dashboard/dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '@nusantara/auth';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const fakeResolvedData = { dashboard: { href: 'https://something/?foo=bar&titled=true', } };
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        DashboardModule,
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
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of(fakeResolvedData) },
        },
        JwtHelperService,
        {
          provide: AuthService,
          use: authServiceSpy
        },
      ],
      declarations: [ DashboardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'shouldRefresh'], ['siteDomain', 'tokenPayload']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets metabase iframe url and replaces query param titled=true with titled=false', waitForAsync(() => {
    // get the full dom rendered by the component
    const iframe = fixture.debugElement.nativeElement.querySelector('iframe');
    if (!!iframe) {
      expect(iframe.src).toEqual('https://something/?foo=bar&titled=false');

      // the above can **also** be tested like this since the component has an ElementRef
      expect(component.metabaseIframe.nativeElement.src).toEqual('https://something/?foo=bar&titled=false');
    }
  }));
});
