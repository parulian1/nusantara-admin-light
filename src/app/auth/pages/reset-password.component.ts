import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'nus-reset-password',
  template: `
    <h1>Reset Password</h1>
    <p>
      Please enter your new password.
    </p>
    <form>

    </form>
  `,
  styles: []
})
export class ResetPasswordComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
