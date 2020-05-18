import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'nus-forgot-password-sent',
  template: `
    <h1>Email Sent</h1>
    <p>
      An email has been sent to your address with a link
      that will allow you to reset your password.  Please
      check your email.
    </p>
    <div>
      <a [routerLink]="['/auth/login']">Return to Login</a>
    </div>
  `,
  styles: []
})
export class ForgotPasswordSentComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
