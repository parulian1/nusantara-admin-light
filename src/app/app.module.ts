import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { ApmService, ApmErrorHandler } from '@elastic/apm-rum-angular';
import { environment } from '@env/environment';

import { ApiPrefixInterceptor, CoreModule } from '@nusantara/core';
import { SharedModule } from '@nusantara/shared';
import { AnonWrapperComponent, MainWrapperComponent } from '@nusantara/view-wrappers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    AnonWrapperComponent,
    MainWrapperComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        authScheme: 'Bearer ',
        allowedDomains: [
          new RegExp('localhost(:(\\d+))?'),
          new RegExp('([\\w\\-\\.]+).bhisma.([\\w\\-\\.]+)?'),
          'marthatilaarshop.com',
          'ez-shop.co.id',
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
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    },
    {
      provide: ApmService,
      useClass: ApmService,
      deps: [Router]
    },
    {
      provide: ErrorHandler,
      useClass: ApmErrorHandler
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(ApmService) apm: ApmService) {
    apm.init(environment.elasticAPM);
  }
}
