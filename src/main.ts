import { DEFAULT_CURRENCY_CODE, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { LOCALE_ID } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    {provide: LOCALE_ID, useValue: 'id-ID' },
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'IDR'}
  ]
})
  .catch(err => console.error(err));
