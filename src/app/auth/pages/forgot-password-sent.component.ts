import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'nus-forgot-password-sent',
  template: `
    <h1 i18n>Email Sent</h1>
    <p i18n>
      An email has been sent to your address with a link
      that will allow you to reset your password.  Please
      check your email.
    </p>
    <div>
      <a [routerLink]="['/auth/login']" i18n>Return to Login</a>
    </div>
  `
})
export class ForgotPasswordSentComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
