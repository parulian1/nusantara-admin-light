import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'nus-logout',
  template: '<h1>Logout</h1>',
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private service: AuthService,
              private router: Router) { }


  ngOnInit(): void {
    this.service.logout();
    this.router.navigate(['/auth/login']);
  }
}
