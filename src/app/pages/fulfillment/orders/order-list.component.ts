import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AbstractListComponent, PagedResponse} from '@nusantara/core';
import {drf, IOrder, ICheckedOrder} from '@nusantara/models';
import {IOrderFilterValue} from '@nusantara/models/order/filter';
import { SvgIconService } from '@nusantara/services';

@Component({
  selector: 'nus-order-list',
  template: `
    <nus-list-header title="Order" [canAddNew]="false"></nus-list-header>
    <nus-order-filters (filterApplied)="onFilterApplied($event)">
    </nus-order-filters>
    <nus-order-custom-pagination 
      [page]="page" 
      [checklist]="checklist"
      [checkedlist]="checkedlist"
      [appliedFilters]="appliedFilter"
      (masterSelectChanged)="onMasterSelectedChange($event)">
    </nus-order-custom-pagination>

    <table>
      <colgroup>
        <col width="20%">
        <col width="16%">
        <col width="16%">
        <col width="16%">
        <col width="16%">
        <col width="16%">
      </colgroup>
      <thead>
        <tr>
          <th>Order Number</th>
          <th>Platform</th>
          <th>
            <span class="nowrap">
              Paid Date
              <nus-sort-toggle field="paid_time"></nus-sort-toggle>
            </span>
          </th>
          <th>Logistic</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of checklist">
          <td>
            <span class="checklist">
              <mat-checkbox [(ngModel)]="entity.isSelected" value="{{entity.index}}" (change)="getCheckedItemList()">
              </mat-checkbox>
              <a [routerLink]="[entity.order|entityToSlug]">{{ entity.order.orderNumber }}</a>
            </span>
          </td>
          <td>{{ entity.order.platform }}</td>
          <td>{{ entity.order.paidTime | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
          <td>{{ entity.order.shippingMethods.join(', ') }}</td>
          <td>
            <span class="badge" [ngClass]="{
              'success': statusWithSuccessBadge.includes(entity.order.status),
              'alert': statusWithAlertBadge.includes(entity.order.status),
              'error': statusWithErrorBadge.includes(entity.order.status) }">
              {{ entity.order.status | titlecase }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
`,
  styles: [
    'thead tr th:first-child, tbody tr td:first-child { min-width: 200px; }',
    '.checklist { display: flex; align-items: center; }',
    '.checklist mat-checkbox { margin-right: 10px; margin-bottom: 12px; }',
    '::ng-deep .date-range-footer { padding: 10px 25px; }',
    '.nowrap { white-space: nowrap; }'
  ]
})
export class OrderListComponent extends AbstractListComponent<IOrder> implements OnInit, AfterContentChecked {

  statusWithAlertBadge = ['unpaid', 'waiting', 'paid', 'ready', 'shipped'];
  statusWithSuccessBadge = ['complete'];
  statusWithErrorBadge = ['refunded', 'returned', 'cancelled'];

  checklist: Array<ICheckedOrder>;
  checkedlist: Array<string>;
  appliedFilter: IOrderFilterValue;

  constructor(
    public route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private svgIconService: SvgIconService) { super(route); }

  ngOnInit(): void {
    this.route.data.subscribe((
      data: { page: PagedResponse<IOrder>, orderType: drf.IChoice[]}) => {
      this.page = data.page;
      this.checklist = this.page.entities.map(  
        (entity, index) => ({ index: index, order: entity, isSelected: false })
      )
    });
    super.ngOnInit();
    this.svgIconService.registerIcons();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  onMasterSelectedChange(event: boolean){
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = event;
    }
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedlist = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected){
        this.checkedlist.push(this.checklist[i].order.orderNumber);
      }
    }
  }

  onFilterApplied(event: IOrderFilterValue){
    this.appliedFilter = event; 
  }
}
