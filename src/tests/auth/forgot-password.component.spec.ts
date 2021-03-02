import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

import { MockActivatedRoute, MockJwtHelperService } from '../helpers/mocks';
import { ForgotPasswordComponent } from '@nusantara/auth/pages/forgot-password.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [
        ForgotPasswordComponent,
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
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can request a password reset', () => {
    component.email.setValue('bugil@gramedia.digital');
    component.siteDomain.setValue('bhisma.cloud');

    component.submitPasswordReset();

    const req = httpTestingController.expectOne('/api/iam/auth/password-reset/');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(
      {email: 'bugil@gramedia.digital'}
    );
    req.flush({message: `I'm a little teapot`});

    httpTestingController.verify();
  });
});
