import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent, getSlugFromHref } from '@nusantara/core';

import { IInventoryOrderSummary } from '@nusantara/models/inventory';

/**
 * A searchable list of all products.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-pending-order-list',
  template: `
    <nus-list-header
      title="Inventory Orders"
      [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Status</th>
        <th>Created By</th>
        <th>Reviewed By</th>
        <th>Warehouse</th>
        <th>Date</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[getRouterLink(entity)]">{{ entity|entityToSlug }}</a></td>
        <td>{{ entity.type }}</td>
        <td>{{ entity.status }}</td>
        <td>{{ entity.createdBy.name }}</td>
        <td>{{ entity.reviewedBy?.name }}</td>
        <td>{{ entity.warehouse.name }}</td>
        <td>{{ entity.created|date: 'dd MMM yyyy HH:mm' }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: []
})
export class InventoryOrderListComponent extends AbstractListComponent<IInventoryOrderSummary> {
  constructor(route: ActivatedRoute) { super(route); }

  getRouterLink(entity: IInventoryOrderSummary) {
    if (entity.type === 'receiving_order') {
      return `/inventory/receiving/${getSlugFromHref(entity.href)}`;
    } else if (entity.type === 'transfer_order') {
      return `/inventory/transfer-order/${getSlugFromHref(entity.href)}`;
    }
    return '';
  }
}
