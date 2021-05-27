import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { PagedResponse } from '@nusantara/core';
import { marketplace } from '@nusantara/models';
import * as fromMarketplaces from '@nusantara/reducers/marketplace.reducers';
import * as shopActions from '@nusantara/actions';

@Component({
  selector: 'nus-marketplace-setup',
  template: `<h1 class="title-1">Connect to Marketplace</h1>
    <nus-empty-list
      *ngIf="!page?.entities?.length; else elseBlock"
      title="No Connected Store Yet!"
      description="Add a marketplace store to manage all your products in one place."
      addUrl="new"
      addText="Add Store">
    </nus-empty-list>
    <ng-template #elseBlock>
      <div class="header">
        <div>
          <h1 class="heading-1">Store List</h1>
          <p>All marketplace stores you connected are listed here.</p>
        </div>
        <button [routerLink]="['new']" class="control"><i class="material-icons">add</i> Add</button>
      </div>

      <nus-pagination [page]="page"></nus-pagination>
      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Marketplace</th>
            <th>Warehouse</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entity of page.entities">
            <td>{{ entity.name }}</td>
            <td>{{ entity.marketplace }}</td>
            <td>{{ entity.warehouse.name }}</td>

            <td *ngIf="entity.isConnected == false">
              <span class="badge alert">Not Connected</span>
            </td>
            <td *ngIf="entity.isConnected == true">
              <span class="badge success">Connected</span>
            </td>

            <td *ngIf="entity.isConnected == true">
              <a [routerLink]="['product-class/', entity.slug]" (click)="setSelectedShop(entity)">
                Map Class & Attribute
              </a>
            </td>
            <td *ngIf="entity.isConnected == false">
              <a [routerLink]="[entity.slug]">Reconnect</a>
            </td>
          </tr>
        </tbody>
      </table>
      <nus-pagination [page]="page"></nus-pagination>
    </ng-template>
      `,
  styles: [
    '.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }',
    'p { color: var(--darken-grey); }',
    'button { display: flex; justify-content: center; align-items: center; }',
    '.material-icons { font-size: 20px; }',
    ':host ::ng-deep nus-empty-list div { height: 100vh }'
  ],
})
export class ConnectComponent implements OnInit {
  page: PagedResponse<marketplace.IShop>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromMarketplaces.State>
  ) {}

  ngOnInit() {
    this.route.data.subscribe(
      (data: { page: PagedResponse<marketplace.IShop> }) => {
        this.page = data.page;
      }
    );
  }

  setSelectedShop(shop: marketplace.IShop) {
    this.store.dispatch(new shopActions.SetCurrentShop(shop));
  }
}
