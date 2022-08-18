import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICustomer } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-customer-list',
  template: `
    <nus-list-header i18n-title
      title="Customers"
      description="Users that can make purchases.  This includes employees.">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table class="customer-list">
      <thead>
      <tr>
        <th i18n class="col-email">Email</th>
        <th i18n class="col-name">First Name</th>
        <th i18n class="col-name">Last Name</th>
        <th i18n class="numeric col-date">Date Registered</th>
        <th i18n class="col-ltv">LTV</th>
        <th i18n class="numeric col-date">Last Login</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td class="col-email"><a [routerLink]="[entity|entityToSlug]">{{ entity.email }}</a></td>
        <td class="col-name">{{ entity.firstName }}</td>
        <td class="col-name">{{ entity.lastName }}</td>
        <td class="numeric col-date">{{ entity.dateJoined|date: 'dd/MM/yyyy' }}</td>
        <td class="col-ltv">{{ entity.profile?.lifetimeValue|currency:"IDR" }}</td>
        <td class="numeric col-date">{{ entity.lastLogin|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
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
      .customer-list tbody td {
        word-break: break-all;
        word-wrap: anywhere;
        white-space: break-spaces;
      }
    `
  ]

})
export class CustomerListComponent extends AbstractListComponent<ICustomer> {
  constructor(route: ActivatedRoute) { super(route); }
}
