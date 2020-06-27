import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@nusantara/auth';
import { Router } from '@angular/router';


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
export class AppComponent implements OnInit, OnDestroy {

  private timer;
  redirectOnFail = '/auth/login';

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    this.timer = setInterval(() => {
      if (this.authService.shouldRefresh) {
        this.authService.refresh().subscribe((result) => {
          if (!result.success) {
            this.authService.logout();
            this.router.navigate([this.redirectOnFail, ]);
          }
        });
      }
    }, 10000);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

}
