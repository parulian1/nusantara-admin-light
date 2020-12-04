import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginComponent } from '@nusantara/auth/pages/login.component';
import { AuthModule, AuthService } from '@nusantara/auth';

import { MockActivatedRoute, MockJwtHelperService } from '../helpers/mocks';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastComponent } from '@nusantara/core';
import { SharedModule } from '@nusantara/shared';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AuthModule,
        SharedModule,
      ],
      declarations: [
        LoginComponent,
        ToastComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: JwtHelperService, useClass: MockJwtHelperService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('set afterLoginUrl to "next" query param', () => {
    const activatedRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;
    activatedRoute.testQueryParamMap = { next: '/pages/another-page' };
    expect(component.afterLoginUrl).toBe('/pages/another-page');
  });

  it('sets afterLoginUrl to "/" if "next" query param missing', () => {
    expect(component.afterLoginUrl).toBe('/');
  });

  it('handles successful login with default route', () => {

    const router = TestBed.inject(Router);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    component.password.setValue('p@ssw0rd24');
    component.email.setValue('derek.curtis@gramedia.digital');
    component.siteDomain.setValue('gramedia.com');

    component.login();

    const req = httpTestingController.expectOne('/api/iam/auth/login/');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(
      {email: 'derek.curtis@gramedia.digital', password: 'p@ssw0rd24'}
    );
    req.flush({access: 'fake.token.bro', refresh: 'im.fake.too'});

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/');
  });

  it('handles successful login with a ?next query param', () => {

    const activatedRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;
    activatedRoute.testQueryParamMap = { next: '/pages/another-page' };

    const router = TestBed.inject(Router);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    component.password.setValue('p@ssw0rd24');
    component.email.setValue('derek.curtis@gramedia.digital');
    component.siteDomain.setValue('gramedia.com');

    component.login();

    const req = httpTestingController.expectOne('/api/iam/auth/login/');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(
      {email: 'derek.curtis@gramedia.digital', password: 'p@ssw0rd24'}
    );
    req.flush({access: 'fake.token.bro', refresh: 'im.fake.too'});

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/pages/another-page');
  });


});
