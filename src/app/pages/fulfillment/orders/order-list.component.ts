import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IOrder } from '@nusantara/models';


@Component({
  selector: 'nus-order-list',
  template: `
    <nus-list-header
      title="Products">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Order Number</th>
        <th>Customer</th>
        <th>Status</th>
        <th>Total</th>
        <th>Created</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.orderNumber }}</a></td>
        <td></td>
        <td>{{ entity.status }}</td>
        <td>{{ entity.cartTotals.grandTotal|currency:"IDR" }}</td>
        <td>{{ entity.created | date }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: []
})
export class OrderListComponent extends AbstractListComponent<IOrder> {
  constructor(route: ActivatedRoute) { super(route); }
}
