import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@nusantara/auth';

@Component({
  selector: 'nus-root',
  template: `
    <router-outlet></router-outlet>
    <nus-toast></nus-toast>
  `,
  styles: [
    'nus-toast { position: fixed; right: 0; bottom: 0 }',
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  private static TEN_SECONDS = 10_000;
  private static LOGIN_URL = '/auth/login';

  private timer;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.timer = setInterval(() => {
      if (this.authService.shouldRefresh) {
        this.authService.refresh().subscribe((result) => {
          if (!result.success) {
            this.authService.logout();
            this.router.navigate([AppComponent.LOGIN_URL, ]);
          }
        });
      }
    }, AppComponent.TEN_SECONDS);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

}
