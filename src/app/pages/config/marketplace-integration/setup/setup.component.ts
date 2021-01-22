import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PagedResponse, ToastLevelEnum, ToastService } from '@nusantara/core';
import { IShop } from '@nusantara/models';
import * as fromMarketplaces from '@nusantara/reducers/marketplace.reducers';
import * as shopActions from '@nusantara/actions';

@Component({
  selector: 'nus-marketplace-setup',
  template: `<h1>Marketplace Set Up</h1>
    <nus-empty-list
      *ngIf="!page?.entities?.length; else elseBlock"
      [title]="'No Connected Store Yet!'"
      [description]="
        'Add a marketplace store to manage all your products in one place.'
      "
      [cancelUrl]="['../../..']"
      [addUrl]="[
        'connect',
        'new'
      ]"
      [addText]="'Add Store'"
    >
    </nus-empty-list>
    <ng-template #elseBlock>
      <div class="wrapper">
        <div>
          <h2>Store List</h2>
          <p>All marketplace stores you connected are listed here.</p>
        </div>
        <div>
          <button
            [routerLink]="['connect', 'new']"
            class="control"
          >
            <i class="material-icons">add</i> Add Store
          </button>
        </div>
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

            <td *ngIf="entity.isConnected == false">Not Connected</td>
            <td *ngIf="entity.isConnected == true" style="color: #21A656">
              Connected
            </td>

            <td *ngIf="entity.isConnected == true">
              <a
                [routerLink]="['product-class/', entity.slug]"
                (click)="setSelectedShop(entity)"
                ><i class="material-icons">launch</i> Set Up Store</a
              >
              <a
                [routerLink]="['edit-shipping/', entity.slug]"
                (click)="setSelectedShop(entity)"
                ><i class="material-icons">launch</i> Edit Shipping
              </a>
            </td>

            <td *ngIf="entity.isConnected == false">
              <a [routerLink]="['connect', entity.slug]"
                ><i class="material-icons">launch</i> Reconnect</a
              >
              <a class="disabled-link"
                ><i class="material-icons">launch</i> Edit Shipping
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <nus-pagination [page]="page"></nus-pagination>
    </ng-template>`,
  styles: [
    `
      th,
      td {
        text-align: left;
      }

      a {
        display: flex;
        text-decoration: none;
      }

      h2 {
        color: #365dc3;
      }

      button {
        display: flex;
        align-items: center;
      }

      button:not(:first-child) {
        margin-left: 15px;
      }

      .wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .container {
        height: 450px;
        padding: 10px 20px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .disabled-link {
        color: #b4b4b4;
      }
    `,
  ],
})
export class SetupComponent implements OnInit {
  isBusy: boolean;
  page: PagedResponse<IShop>;

  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
    private store: Store<fromMarketplaces.State>
  ) {}

  ngOnInit() {
    this.isBusy = true;
    this.route.data.subscribe(
      (data: { page: PagedResponse<IShop> }) => {
        this.page = data.page;
        this.isBusy = false;
      },
      () => {
        this.toast.addMessage(
          'Something went wrong',
          'error',
          ToastLevelEnum.error
        );
        this.isBusy = false;
      }
    );
  }

  setSelectedShop(shop: IShop) {
    this.store.dispatch(new shopActions.SetCurrentShop(shop));
  }
}
