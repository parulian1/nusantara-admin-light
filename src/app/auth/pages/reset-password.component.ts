import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'nus-reset-password',
  template: `
    <h1 i18n>Reset Password</h1>
    <p i18n>
      Please enter your new password.
    </p>
    <form>

    </form>
  `
})
export class ResetPasswordComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
