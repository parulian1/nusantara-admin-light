import {ErrorHandler, Inject, LOCALE_ID, NgModule} from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {BrowserModule, Title} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import {ApmService, ApmErrorHandler, ApmModule} from '@elastic/apm-rum-angular';
import { environment } from '@env/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

import { ApiPrefixInterceptor, CoreModule } from '@nusantara/core';
import { SharedModule } from '@nusantara/shared';
import { AnonWrapperComponent, MainWrapperComponent } from '@nusantara/view-wrappers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {APP_BASE_HREF} from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    AnonWrapperComponent,
    MainWrapperComponent,
  ],
  imports: [
    ApmModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        authScheme: 'Bearer ',
        allowedDomains: [
          new RegExp('localhost(:(\\d+))?'),
          new RegExp('([\\w\\-\\.]+).bhisma.([\\w\\-\\.]+)?'),
          'marthatilaarshop.com',
          'ez-shop.co.id',
          new RegExp('.+')
        ],
        disallowedRoutes: [
          'localhost:8080/api/iam/login/',
          'localhost:8080/api/iam/reset-password/',
        ]
      }
    }),
    StoreModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    },
    ApmService,
    {
      provide: ErrorHandler,
      useClass: ApmErrorHandler
    },
    {
      provide: APP_BASE_HREF,
      useFactory: (locale: string) => `/${locale}`,
      deps: [LOCALE_ID]
    },
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apmService: ApmService) {
    const apm = apmService.init(environment.elasticAPM);
  }
}
