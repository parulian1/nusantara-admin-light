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
      title="Inventory Order List"
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
        <th class="numeric">Date</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[getRouterLink(entity)]">{{ entity|entityToSlug }}</a></td>
        <td>{{ entity.type }}</td>
        <td>
          <span class="badge" [ngClass]="{
            'success': entity.status === 'pending',
            'alert': entity.status === 'approved',
            'error': entity.status === 'rejected' }">
            {{ entity.status | titlecase }}
          </span>
        </td>
        <td>{{ entity.createdBy.name ? entity.createdBy.name : '-' }}</td>
        <td>{{ entity.reviewedBy ? entity.reviewedBy?.name : '-'}}</td>
        <td>{{ entity.warehouse.name }}</td>
        <td class="numeric">{{ entity.created|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
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
