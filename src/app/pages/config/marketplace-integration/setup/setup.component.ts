import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { PagedResponse } from '@nusantara/core';
import { IShop } from '@nusantara/models';
import * as fromMarketplaces from '@nusantara/reducers/marketplace.reducers';
import * as shopActions from '@nusantara/actions';

@Component({
  selector: 'nus-marketplace-setup',
  template: `<h1 class="title-1">Marketplace Set Up</h1>
    <nus-empty-list
      *ngIf="!page?.entities?.length; else elseBlock"
      title="No Connected Store Yet!"
      description="Add a marketplace store to manage all your products in one place."
      addUrl="new"
      addText="Add Store">
    </nus-empty-list>
    <ng-template #elseBlock>
      <nus-pagination [page]="page"></nus-pagination>
      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Warehouse</th>
            <th>Status</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entity of page.entities">
            <td>{{ entity.name }}</td>
            <td>{{ entity.warehouse.name }}</td>

            <td *ngIf="entity.isConnected == false">
              <span class="badge alert">Not Connected</span>
            </td>
            <td *ngIf="entity.isConnected == true">
              <span class="badge success">Connected</span>
            </td>

            <td>
              <a [routerLink]="['edit-shipping/', entity.slug]"
                (click)="setSelectedShop(entity)" 
                [ngClass]="{'disabled': entity.isConnected === false}">
                Edit Shipping
              </a>
            </td>
            <td>
              <a class="disabled">Set Up Showcase</a>
            </td>
          </tr>
        </tbody>
      </table>
      <nus-pagination [page]="page"></nus-pagination>
    </ng-template>`,
  styles: [
    'thead th, tbody td { text-align: left }'
  ],
})
export class SetupComponent implements OnInit {
  page: PagedResponse<IShop>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromMarketplaces.State>
  ) {}

  ngOnInit() {
    this.route.data.subscribe(
      (data: { page: PagedResponse<IShop> }) => {
        this.page = data.page;
      }
    );
  }

  setSelectedShop(shop: IShop) {
    this.store.dispatch(new shopActions.SetCurrentShop(shop));
  }
}
