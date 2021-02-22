import {AfterContentChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractListComponent, PagedResponse} from '@nusantara/core';
import {drf, IOrder, ICheckedOrder } from '@nusantara/models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nus-order-list',
  template: `
    <nus-list-header title="Order" [canAddNew]="false"></nus-list-header>
    <div>
      <label>
        <span>Filter</span>
        <div class="filters">
          <nus-order-date-filter 
            (startDate)="startDateChange($event)" 
            (endDate)="endDateChange($event)">
          </nus-order-date-filter>
          <mat-form-field>
            <mat-select [disableOptionCentering]="true" panelClass="mat-select-panel" [(ngModel)]="selectedPlatform">
              <mat-option value="allPlatform">All Platform</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-select 
              [disableOptionCentering]="true" panelClass="mat-select-panel" 
              [(ngModel)]="selectedStatus"
              (ngModelChange)="onStatusChanged($event)">
              <mat-option 
                *ngFor="let opt of orderStatuses" 
                value="opt.value">
                {{opt.displayName}}            
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-select [disableOptionCentering]="true" panelClass="mat-select-panel" [(ngModel)]="selectedLogistics">
              <mat-option value="allLogistic">All Logistics</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </label>
    </div>

    <nus-order-custom-pagination 
      [page]="page" 
      [checklist]="checklist"
      [checkedList]="checkedList"
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
              <nus-sort-toggle [field]="'paidDate'">
              </nus-sort-toggle>
            </span>
          </th>
          <th>Logistic</th>
          <th>Status</th>
          <th>
            <span class="nowrap">
              Time Limit
              <nus-sort-toggle [field]="'timeLimit'">
              </nus-sort-toggle>
            </span>
          </th>
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
          <td></td>
          <td></td>
          <td></td>
          <td>
            <span class="badge" [ngClass]="{
              'success': statusWithSuccessBadge.includes(entity.order.status),
              'alert': statusWithAlertBadge.includes(entity.order.status),
              'error': statusWithErrorBadge.includes(entity.order.status) }">
              {{ entity.order.status | titlecase }}
            </span>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
`,
  styles: [
    '.filters { display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 16px; }',
    '.button-action { display: flex; justify-content: space-between; align-items: center; }',
    '.button-action button:not(:first-child) { margin-left: 16px; }', 
    'thead tr th:first-child, tbody tr td:first-child { min-width: 200px; }',
    '.select-date { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px; }',
    `.svg {
        content: "";
        position: absolute;
        height: 10px;
        width: 10%;
        background-image: url("assets/arrowDown.svg");
        background-size: 12px; 
      }`,
    '.custom-date-filter { display: none; }',
    '.checklist { display: flex; align-items: center; }',
    '.checklist mat-checkbox { margin-right: 10px; margin-bottom: 12px; }',
    '::ng-deep .date-range-footer { padding: 10px 25px; }',
    '.nowrap { white-space: nowrap; }'
  ]
})
export class OrderListComponent extends AbstractListComponent<IOrder> implements OnInit, AfterContentChecked {
  @ViewChild("calendar") matCalendar: ElementRef;

  orderStatuses: Array<drf.IChoice>;
  form: FormGroup;
  timeoutId: any;
  reloadTimeout = 650;
  filterParams: {
    status: string,
  } = {
    status: ''
  };

  statusWithAlertBadge = ['unpaid', 'waiting', 'paid', 'ready', 'shipped'];
  statusWithSuccessBadge = ['complete'];
  statusWithErrorBadge = ['refunded', 'returned', 'cancelled'];

  selectedPlatform = 'allPlatform';
  selectedStatus = 'paid';
  selectedLogistics = 'allLogistic';

  checklist: Array<ICheckedOrder>;
  checkedList: Array<ICheckedOrder>;

  constructor(
    public route: ActivatedRoute, 
    public router: Router, 
    private cdref: ChangeDetectorRef) { super(route); }

  ngOnInit(): void {
    this.route.data.subscribe((
      data: { page: PagedResponse<IOrder>, orderType: drf.IChoice[], orderStatus: drf.IChoice[]}) => {
      this.page = data.page;
      this.orderStatuses = data.orderStatus;
      
      const theQuery = this.route.queryParams;
    });

    this.route.queryParams.subscribe((queryParam: any) => {
      this.filterParams.status = queryParam.status || '';
    });

    this.checklist = this.page.entities.map(
      (entity, index) => ({ index: index, order: entity, isSelected: false })
    )
    
    super.ngOnInit();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public onStatusChanged(event) {

    this.timeoutId = setTimeout(() => {
      // wait to see if the user is still typing more before navigating
      const params = {status: event.target.value};
      this.router.navigate(
        ['.'],
        {
          queryParams: params,
          relativeTo: this.route
        }
      );
    }, this.reloadTimeout);

  }

  onMasterSelectedChange(event: boolean){
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = event;
    }
    this.getCheckedItemList();
  }

  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
      this.checkedList.push(this.checklist[i]);
    }
  }

  startDateChange(event: string){
    console.log(event);
  }

  endDateChange(event: string){
    console.log(event);
  }
}
