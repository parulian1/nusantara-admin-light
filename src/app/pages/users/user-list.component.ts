import { Component, OnInit } from '@angular/core';
import { IUserSummary, UserService } from './users.service';


@Component({
  selector: 'nus-user-list',
  template: `
    <h1>Users</h1>
    <table>
      <tbody>
        <tr *ngFor="let entity of entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.email }}</a></td>
          <td>{{ entity.firstName }}</td>
          <td>{{ entity.lastName }}</td>
          <td>{{ entity.isStaff }}</td>
          <td>{{ entity.dateJoined }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [``]
})
export class UserListComponent implements OnInit {

  public entities: Array<IUserSummary> = [];

  constructor(private service: UserService) { }

  hrefToEmail(href) {

  }

  ngOnInit(): void {
    this.service.fetchList().subscribe(
      users => this.entities = users
    );
  }
}
