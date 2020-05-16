import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '@nusantara/services';


@Component({
  selector: 'nus-customer-detail',
  template: `
    <h1>Customer Details</h1>
    <tr>
      <td>{{ entity.email }}</td>

    </tr>
  `,
  styles: [``]
})
export class CustomerDetailComponent implements OnInit {

  public entity: any;

  constructor(private service: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { user: any }) => {
        this.entity = data.user;
      });
  }
}
