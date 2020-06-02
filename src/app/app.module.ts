import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { ApiPrefixInterceptor } from '@nusantara/core';
import { AnonWrapperComponent, MainWrapperComponent } from '@nusantara/view-wrappers';
import { CoreModule } from '@nusantara/core/core.module';
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
    NgxEchartsModule.forRoot({
      echarts
    }),
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        authScheme: 'Bearer ',
        whitelistedDomains: [
          'localhost:8080',
          'localhost:4200',
          'localhost:4201',
          'bhisma.cloud',
          'marthatilaarshop.com',
        ],
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
