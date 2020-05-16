import { Component } from '@angular/core';


@Component({
  selector: 'nus-root',
  template: '<router-outlet></router-outlet><nus-toast></nus-toast>',
  styles: [
    `nus-toast {
      position: fixed;
      right: 0;
      bottom: 0
    }`
  ]
})
export class AppComponent { }
