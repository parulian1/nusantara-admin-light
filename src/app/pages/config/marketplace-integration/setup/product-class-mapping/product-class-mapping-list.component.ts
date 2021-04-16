import { Component, OnInit } from '@angular/core';
import { marketplace } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PagedResponse, ToastLevelEnum, ToastService } from '@nusantara/core';
import * as fromReducer from '@nusantara/reducers';

@Component({
  selector: 'nus-product-class-mapping-list',
  template: `
    <h1 class="title-1">Marketplace Configuration</h1>
    <div class="header">
      <h2 class="heading-1">Product Class List</h2>
      <p>
        Map your Product Classes to
        {{ (currentShop$ | async)?.marketplace | titlecase }} Categories &
        Attributes.
      </p>
    </div>
    <nus-pagination *ngIf="page?.entities?.length" [page]="page"></nus-pagination>
    <table>
      <thead>
        <tr>
          <th>Product Class</th>
          <th> {{ (currentShop$ | async)?.marketplace | titlecase }} Category & Attribute</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td>
            <div>{{ entity.name }}</div>
            <div *ngIf="entity.attribute">({{ entity.attribute }})</div>
          </td>
          <td *ngIf="entity.category">
            <div>{{ entity.category }}</div>
            <div *ngIf="entity.categoryAttribute">({{ entity.categoryAttribute }})</div>
          </td>
          <td *ngIf="!entity.category">-</td>
          <td *ngIf="entity.isMapped == false">
            <span class="badge alert">Not Matched</span>
          </td>
          <td *ngIf="entity.isMapped == true">
            <span class="badge success">Done</span>
          </td>
          <!--Action to Match-->
          <td>
            <a *ngIf="entity.isMapped" class="disabled">
              Edit Mapping
            </a>
            <a *ngIf="!entity.isMapped" [routerLink]="[entity.slug]" [state]="{ productClass: entity }">
              Start Mapping
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <nus-pagination
      *ngIf="page?.entities?.length"
      [page]="page"
    ></nus-pagination>
  `,
  styles: [
    '.header { margin-bottom: 10px }',
    'p { color: var(--darken-grey); }',
  ],
})
export class ProductClassMappingListComponent implements OnInit {
  productClasses: marketplace.IProductClass[];
  currentShop$: Observable<marketplace.IShop>;
  isBusy: boolean;
  page: PagedResponse<marketplace.IProductClass>;

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
      (data: { page: PagedResponse<marketplace.IProductClass> }) => {
        this.page = data.page;
        this.isBusy = false;
      }
    );
  }
}
