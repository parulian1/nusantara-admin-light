import { Component, OnInit } from '@angular/core';

/**
 * Serves as the router outlet for any views that the user visits
 * while not logged in (basically login, reset password).
 *
 * This serves to hide the styling of the primary pages layout
 * while the user is logged out.
 */
@Component({
  selector: 'nus-anon-wrapper',
  template: `
    <div id="auth-container">
      <img src="/assets/bhisma-logo.png" alt="Logo">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: 1fr 500px 1fr;
      grid-template-rows: 1fr 300px 1fr;
      min-height: 100vh;
      background-color: var(--nav-background);
    }
    #auth-container {
      grid-column: 2;
      grid-row: 2;
      background-color: white;
      box-sizing: border-box;
      padding: 15px;
      box-shadow: 0 0 8px -1px rgba(0,0,0,0.44);
    }
  `]
})
export class AnonWrapperComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
