import { Component, OnInit } from '@angular/core';
import { AbstractListComponent } from '@nusantara/core';
import { IOrder } from '@nusantara/models';

@Component({
  selector: 'nus-order-list',
  template: `
    <nus-list-header
      title="Products">
    </nus-list-header>

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
        <td></td>
        <td></td>
        <td></td>
      </tr>
      </tbody>
    </table>


  `,
  styles: []
})
export class OrderListComponent extends AbstractListComponent<IOrder> implements OnInit {
  constructor() { super(); }
  ngOnInit(): void { }
}
