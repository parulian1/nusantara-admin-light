import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@nusantara/auth/auth.service';
import { ToastService } from '@nusantara/core';

/**
 * When visited, automatically logs the current user out,
 * and then redirects them to the login page.
 */
@Component({
  selector: 'nus-logout',
  template: '<h1 i18n>Logout</h1>'
})
export class LogoutComponent implements OnInit {

  constructor(private service: AuthService,
              private router: Router,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.service.logout();

    this.toastService.addMessage('You have been logged out', 'Logged Out');

    this.router.navigate(['/auth/login']);
  }
}
