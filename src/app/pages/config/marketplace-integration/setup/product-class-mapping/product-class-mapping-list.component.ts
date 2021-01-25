import { Component, OnInit } from '@angular/core';
import { IProductClass, IShop } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PagedResponse, ToastLevelEnum, ToastService } from '@nusantara/core';
import * as fromReducer from '@nusantara/reducers';

@Component({
  selector: 'nus-product-class-mapping-list',
  template: `
    <h1 class="heading-1">Marketplace Configuration</h1>

    <h2 class="sub_title">Product Class List</h2>
    <p>
      Map your Product Classes to
      {{ (currentShop$ | async)?.marketplace | titlecase }} Categories &
      Attributes.
    </p>

    <nus-pagination
      *ngIf="page?.entities?.length"
      [page]="page"
    ></nus-pagination>
    <table>
      <thead>
        <tr>
          <th>Product Class</th>
          <th>
            {{ (currentShop$ | async)?.marketplace | titlecase }} Category &
            Attribute
          </th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td>
            <span style="color: #5A5A5A">{{ entity.name }}</span>
            <br />
            <span style="color: #B4B4B4">{{ entity.attribute }}</span>
          </td>
          <td *ngIf="entity.category">
            <span style="color: #5A5A5A">{{ entity.category }}</span>
            <br />
            <span style="color: #B4B4B4">{{ entity.categoryAttribute }}</span>
          </td>
          <td *ngIf="!entity.category">-</td>
          <td *ngIf="entity.isMapped == false">Not Match</td>
          <td *ngIf="entity.isMapped == true" style="color: #21A656">Done</td>
          <!--Action to Match-->
          <td *ngIf="entity.isMapped == false">
            <a [routerLink]="[entity.slug]" [state]="{ productClass: entity }">
              <i class="material-icons">settings_applications</i> Start Mapping
            </a>
          </td>
          <td *ngIf="entity.isMapped == true" style="color: #21A656">Done</td>
        </tr>
      </tbody>
    </table>
    <nus-pagination
      *ngIf="page?.entities?.length"
      [page]="page"
    ></nus-pagination>
  `,
  styles: [
    `
      th,
      td {
        text-align: left;
      }
      h1 {
        font-weight: bold;
      }
      .material-icons {
        font-size: 18px;
        padding-right: 10px;
      }
      a {
        display: flex;
        text-decoration: none;
      }
      .sub_title {
        color: #365dc3;
      }
    `,
  ],
})
export class ProductClassMappingListComponent implements OnInit {
  productClasses: IProductClass[];
  currentShop$: Observable<IShop>;
  isBusy: boolean;
  page: PagedResponse<IProductClass>;


  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
    private store: Store<fromReducer.State>
  ) {
    this.currentShop$ = this.store.select(fromReducer.getCurrentShop);
  }

  ngOnInit() {
    this.isBusy = true;
    this.route.data.subscribe(
      (data: { page: PagedResponse<IProductClass> }) => {
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
}
