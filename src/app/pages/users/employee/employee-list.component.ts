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

    <table class="employee-list">
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
          <td class="col-email">
            <a [routerLink]="[entity | entityToSlug]">{{ entity.email }}</a>
          </td>
          <td class="col-name">{{ entity.identityNumber | emptyData }}</td>
          <td class="col-name">{{ entity.firstName | emptyData }}</td>
          <td class="col-name">{{ entity.lastName | emptyData }}</td>
          <td class="numeric col-date">{{ entity.dateJoined | date: 'dd/MM/yyyy HH:mm:ss' | emptyData }}</td>
          <td class="numeric col-date">{{ entity.lastLogin | date: 'dd/MM/yyyy HH:mm:ss' | emptyData }}</td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [
    `

      .col-name {
        width: 15%
      }
      .col-email {
        width: 25%;
      }
      .col-date, .col-ltv {
        min-width: 5%;
        max-width: 10%;
      }
      .employee-list tbody td {
        word-break: break-all;
        word-wrap: anywhere;
        white-space: break-spaces;
      }
    `
  ]

})
export class EmployeeListComponent extends AbstractListComponent<IEmployee> {
  constructor(route: ActivatedRoute) {
    super(route);
  }
}
