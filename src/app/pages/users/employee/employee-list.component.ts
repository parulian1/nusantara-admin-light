import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IEmployee } from '@nusantara/models/user';

@Component({
  selector: 'nus-employee-list',
  template: `
    <nus-list-header title="Employees" i18n-title></nus-list-header>
    <nus-filter-pos-employee></nus-filter-pos-employee>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th i18n>Email</th>
          <th i18n>ID Employee</th>
          <th i18n>First Name</th>
          <th i18n>Last Name</th>
          <th class="numeric" i18n>Date Registered</th>
          <th class="numeric" i18n>Last Login</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td>
            <a [routerLink]="[entity | entityToSlug]">{{ entity.email }}</a>
          </td>
          <td>{{ entity.identityNumber | emptyData }}</td>
          <td>{{ entity.firstName | emptyData }}</td>
          <td>{{ entity.lastName | emptyData }}</td>
          <td class="numeric">{{ entity.dateJoined | date: 'dd/MM/yyyy HH:mm:ss' | emptyData }}</td>
          <td class="numeric">{{ entity.lastLogin | date: 'dd/MM/yyyy HH:mm:ss' | emptyData }}</td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,

})
export class EmployeeListComponent extends AbstractListComponent<IEmployee> {
  constructor(route: ActivatedRoute) {
    super(route);
  }
}
