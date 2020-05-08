import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nus-login',
  template: `
  <form [formGroup]="loginForm" (ngSubmit)="tryLogin()">
    <label>Username
        <input type="text" formControlName="username" required>
    </label>
    <label>
        <input type="password" formControlName="password" required>
    </label>
    <div>
        <button type="submit">Login</button>
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
