import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { PagedResponse } from '@nusantara/core';
import { marketplace } from '@nusantara/models';
import * as fromMarketplaces from '@nusantara/reducers/marketplace.reducers';
import * as shopActions from '@nusantara/actions';
import { MarketplaceClientEnum } from '../connect/markeplace-client-enum';

@Component({
  selector: 'nus-marketplace-setup',
  template: `
    <nus-page-title i18n-title title="Marketplace Set Up"></nus-page-title>
    <nus-empty-list
      *ngIf="!page?.entities?.length; else elseBlock"
      title="No Connected Store Yet!"
      description="Add a marketplace store to manage all your products in one place."
      [addUrl]="['/config', 'marketplace-integration', 'connect', 'new']"
      addText="Add Store">
    </nus-empty-list>
    <ng-template #elseBlock>
      <nus-pagination [page]="page"></nus-pagination>
      <table>
        <thead>
          <tr>
            <th i18n>Store Name</th>
            <th i18n>Warehouse</th>
            <th i18n>Marketplace</th>
            <th i18n>Status</th>
            <th i18n>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entity of page.entities">
            <td>{{ entity.name }}</td>
            <td>{{ entity.warehouse.name }}</td>
            <td>{{ entity.marketplace | titlecase }}</td>

            <td *ngIf="entity.isConnected === false">
              <span class="badge alert" i18n>Not Connected</span>
            </td>
            <td *ngIf="entity.isConnected === true">
              <span class="badge success" i18n>Connected</span>
            </td>

            <td>
              <a [routerLink]="['edit-shipping/', entity.slug]"
                (click)="setSelectedShop(entity)"
                [ngClass]="{'disabled': entity.isConnected === false}" i18n>
                Edit Shipping
              </a>
            </td>
            <td>
              <a [routerLink]="['showcase/', entity.slug]"
                (click)="setSelectedShop(entity)"
                [ngClass]="{ disabled: isDisabledShowcase(entity) }" i18n>
                Set Up Showcase
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <nus-pagination [page]="page"></nus-pagination>
    </ng-template>`,
  styles: [
    'thead th, tbody td { text-align: left }',
    ':host ::ng-deep nus-empty-list div { height: 100vh }'
  ],
})
export class SetupComponent implements OnInit {
  page: PagedResponse<marketplace.IShop>;
  marketplaceClient = MarketplaceClientEnum;

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

  isDisabledShowcase(entity: marketplace.IShop) {
    return (
      entity.marketplace === this.marketplaceClient.shopee ||
      entity.marketplace === this.marketplaceClient.tsc ||
      entity.marketplace === this.marketplaceClient.tiktok ||
      !entity.isConnected
    );
  }
}
