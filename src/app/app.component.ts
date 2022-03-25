import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import { AuthService } from '@nusantara/auth';
import { AppUpdateService } from './core/app-update.service';

declare let gtag: Function;

/**
 * The root component for Nusantara Admin.
 *
 * Aside from hosting the rest of our application, this component performs two additional functions:
 *  1. It removes the pre-loading animations after our app is ready (from index.html)
 *  2. It starts a check (every 10 seconds) to see if an authenticated user's token
 *     needs refresh (and does it, if necessary)
 */
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
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  private static TEN_SECONDS = 10_000;
  private static LOGIN_URL = '/auth/login';

  private timer;

  constructor(private authService: AuthService, private router: Router,
              private appUpdate: AppUpdateService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd){
        gtag('config', 'G-JWQWGC80XR',
          {
            page_path: event.urlAfterRedirects
          }
        );
      }
    });
  }

  /**
   * Starts a check (every 10 seconds) to determine if the user's auth token needs refreshed.
   * If refreshing the user's token fails, then redirect to the login url.
   */
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

  /**
   * Starts to fade-out our loading animations over 3/4 of a second.
   * After the fade-out is completed, the div showing the loading animation
   * will be removed from the DOM.
   */
  ngAfterViewInit() {
    setTimeout(() => {
      const preloader = document.getElementById('preload-animation');
      preloader.classList.add('fadeout');
      setTimeout(() => {
        document.body.removeChild(preloader);
      }, 750);
    }, 750);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

}
