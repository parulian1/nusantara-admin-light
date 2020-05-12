import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { ApiPrefixInterceptor } from '@nusantara/core';
import { AnonWrapperComponent, MainWrapperComponent } from '@nusantara/view-wrappers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    AnonWrapperComponent,
    MainWrapperComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        authScheme: 'Bearer',
        whitelistedDomains: ['localhost:8080'],
        blacklistedRoutes: [
          'localhost:8080/api/iam/login/',
          'localhost:8080/api/iam/reset-password/',
        ]
      }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
