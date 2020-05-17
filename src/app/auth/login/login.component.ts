import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nus-login',
  template: `
    <h1>Login</h1>
    <form [formGroup]="loginForm" (ngSubmit)="tryLogin()">
      <label>
        <span>Username</span>
        <input type="text" formControlName="username" required>
      </label>
      <label>
        <span>Password</span>
        <input type="password" formControlName="password" required>
      </label>
      <div>
          <button type="submit">Login</button>
      </div>
      <div>
        <a [routerLink]="['/auth/forgot-password']">Forgot Password</a>
      </div>
    </form>
  `,
  styles: ['']
})
export class LoginComponent implements OnInit {

  public isBusy = false;
  public loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  constructor() { }

  ngOnInit(): void { }

  public tryLogin() {
    this.isBusy = true;

    this.isBusy = false;
  }


}
