import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthModule, AuthService } from '@nusantara/auth';
import { AppComponent } from '@nusantara/app.component';
import { SharedModule } from '@nusantara/shared';
import { CoreModule } from '@nusantara/core';
import { MockJwtHelperService } from './helpers/mocks';

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
        AuthModule,
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
