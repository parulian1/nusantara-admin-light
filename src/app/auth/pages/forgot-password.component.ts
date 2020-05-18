import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'nus-forgot-password',
  template: `
    <h1>Forgot Password</h1>
    <form>

    </form>
    <div>
      <a [routerLink]="['/auth/login']">Login</a>
    </div>
  `,
  styles: ['']
})
export class ForgotPasswordComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
