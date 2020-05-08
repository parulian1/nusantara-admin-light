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
    <h1>Anon</h1>
    <router-outlet></router-outlet>
  `,
  styles: ['']
})
export class AnonWrapperComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
