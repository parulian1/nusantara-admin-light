// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
//
// import { LogoutComponent } from '@nusantara/auth/pages';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';
// import { AuthService } from '@nusantara/auth';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { MockJwtHelperService } from '../helpers/mocks';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
//
//
// describe('LogoutComponent', () => {
//   let component: LogoutComponent;
//   let fixture: ComponentFixture<LogoutComponent>;
//   const routerMock = jasmine.createSpyObj('Router', ['navigate']);
//
//   const mockRouter = {
//     navigate: jasmine.createSpy('navigate')
//   };
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         RouterTestingModule,
//       ],
//       declarations: [
//         LogoutComponent
//       ],
//       providers: [
//         { provide: JwtHelperService, useClass: MockJwtHelperService },
//         // {provide: Router, useValue: routerMock}
//       ]
//     });
//   });
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(LogoutComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('logs the user out, and then redirects to the login page', () => {
//
//     const [router, authService] = [TestBed.inject(Router), TestBed.inject(AuthService)];
//
//     const logoutSpy = spyOn(authService, 'logout');
//     const navigateSpy = spyOn(router, 'navigate').and.returnValue(null);
//
//     component.ngOnInit();
//
//     expect(logoutSpy).toHaveBeenCalled();
//     expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
//   });
//
// });
