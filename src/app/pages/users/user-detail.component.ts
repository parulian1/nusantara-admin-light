import { Component, OnInit } from '@angular/core';
import { IUser, IUserSummary, UserService } from './users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nus-user-detail',
  template: `
    <h1>User Details</h1>
    <tr>
      <td>{{ entity.email }}</td>

    </tr>
  `,
  styles: [``]
})
export class UserDetailComponent implements OnInit {

  public entity: IUserSummary;

  constructor(private service: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { user: IUser }) => {
        this.entity = data.user;
      });
  }
}
