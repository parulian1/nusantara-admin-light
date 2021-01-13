import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IEmployee } from '@nusantara/models/user';

@Component({
  selector: 'nus-employee-list',
  template: `
    <nus-list-header
      title="Employees"
      description="Users who can actually meh">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.email }}</a></td>
          <td>{{ entity.firstName }}</td>
          <td>{{ entity.lastName }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class EmployeeListComponent extends AbstractListComponent<IEmployee> {
  constructor(route: ActivatedRoute) { super(route); }
}
