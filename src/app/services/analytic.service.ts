import { Inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.prod';
import { WEB_ANALYTIC_GTAG } from '@nusantara/shared/gtag-token';
import { Gtag } from '@nusantara/models/gtag';

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  isLoaded = false;
  id = environment.googleAnalytics;

  constructor(@Inject(WEB_ANALYTIC_GTAG) public gtag: Gtag) {
  }

  addScriptToDom(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        return resolve(this.isLoaded);
      }

      const s: HTMLScriptElement = document.createElement('script');
      s.async = true;

      const initCommands = [
        {command: 'js', value: [new Date()]},
        {command: 'config', value: [this.id]},
      ];

      initCommands.forEach(command => {
        this.gtag(command.command, ...command.value);
      });
      s.src = `https://www.googletagmanager.com/gtag/js?id=${this.id}`;

      s.addEventListener('load', () => {
        this.isLoaded = true;
        return resolve(this.isLoaded);
      });
      s.addEventListener('error', () => {
        return reject(false);
      });

      const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
      head.appendChild(s);
    });
  }
}
