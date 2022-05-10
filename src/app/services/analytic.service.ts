import { Injectable } from '@angular/core';
import { environment } from '@env/environment.prod';

declare let gtag: (...args: (string | {[param: string]: string} | any)[]) => {};

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  isLoaded = false;
  id = environment.googleAnalytics;

  addScriptToDom(): Promise<boolean> {
    console.log('addScriptToDom');
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        return resolve(this.isLoaded);
      }

      const s: HTMLScriptElement = document.createElement('script');
      s.async = true;
      console.log(this.id);
      // ga
      const initCommands = [
        {command: 'js', value: [new Date()]},
        {command: 'config', value: [this.id]},
      ];

      initCommands.forEach(command => {
        gtag(command.command, ...command.value);
      });
      s.src = `https://www.googletagmanager.com/gtag/js?id=${this.id}`;

      s.addEventListener('load', () => {
        return resolve(this.isLoaded = true);
      });
      s.addEventListener('error', () => {
        return reject(false);
      });

      const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
      head.appendChild(s);
    });
  }
}
