import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICheckedOrder } from '@nusantara/models';
import { DialogResult, ToastLevelEnum, ToastService } from '@nusantara/core';
import { PaginationComponent } from '@nusantara/shared/pagination.component';
import { OrderDownloadFileService, OrderReportService, OrderService, SvgIconService } from '@nusantara/services';
import { IOrderFilterValue } from '@nusantara/models/order/filter';
import * as moment from 'moment';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'nus-order-custom-pagination',
  template: `
    <div class="pagination-container">
      <div class="pg-info">
        <span *ngIf="page?.totalResults > 0 && showLabels">
          <mat-checkbox [(ngModel)]="masterSelected"
          (change)="checkUncheckAll()" i18n>
            Selected <strong>{{checkedlist? checkedlist.length: 0 }}/{{ page.entities.length }} </strong>
          </mat-checkbox>
          of<strong> {{ page?.totalResults }}</strong>
        </span>
      </div>
      <div class="pg-action">
        <button
          class="action control secondary"
          mat-button
          [matMenuTriggerFor]="actionMenu"
          (menuOpened)="actionOrder()"
          [disabled]="checkedlist? this.checkedlist.length > 0 ? null: true : true" i18n>
            Action
          <mat-icon class="icon-secondary" svgIcon="arrow-down"></mat-icon>
        </button>
        <mat-menu #actionMenu xPosition="before" >
          <button mat-menu-item (click)="confirmModal.open()" i18n>Accept Selected Order</button>
          <button mat-menu-item (click)="downloadAWBBulk()" i18n>Print Selected Order Label</button>
          <button mat-menu-item (click)="downloadProductList()" i18n>Product List</button>
          <button mat-menu-item (click)="downloadOrderList()" i18n>Order List</button>
        </mat-menu>
        <div class="pg-button">
          <button (click)="goBack()" *ngIf="currentPage > 1"><i class="material-icons">arrow_back_ios</i></button>
          <span><strong>{{ page?.pageNumber }}</strong> / <strong>{{ page.maximumPageCount }}</strong></span>
          <button (click)="goNext()" *ngIf="page.maximumPageCount !== currentPage"><i class="material-icons">arrow_forward_ios</i></button>
        </div>
      </div>
    </div>
    <nus-confirm-modal
      [title]="confirmTitle"
      [content]="confirmText"
      [okText]="confirmOk"
      [cancelText]="confirmCancel">
    </nus-confirm-modal>
  `,
  styles: [
    `.pagination-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px; }`,
    '.pg-info { color: #464646; text-align: left; width: 60%; }',
    '.pg-action { display: flex; gap: 30px; align-items: center; }',
    '.pg-action > button { height: 40px; }',
    '.download { display: flex; justify-content: space-between; align-items: center}',
    '.action { display: flex; justify-content: flex-end; align-items: center}',
    '::ng-deep .icon-secondary svg { fill: var(--secondary); }',
    '::ng-deep button:disabled .icon-secondary svg { fill: var(--grey); }',
    '.pg-button button { border: none; background: none; height: 50px; }',
    '.pg-button { line-height: 50px; }',
    '.pg-button span { line-height: 50px; }',
    '.pg-button i { font-size: 1em; }',
    `::ng-deep .download-date-range-info {
        padding: 6px 16px;
        background: var(--darken-white);
        border-top: var(--grey) solid 1px;
      }`,
    '::ng-deep .mat-menu-panel{min-width: 248px !important; }'
  ]
})
export class OrderCustomPaginationComponent extends PaginationComponent implements OnInit, OnChanges {
  @Input() checklist: Array<ICheckedOrder>;
  @Input() checkedlist: Array<string>;
  @Input() appliedFilters: IOrderFilterValue;
  @Output() masterSelectChanged = new EventEmitter<boolean>();

  @ViewChild(ConfirmModalComponent)confirmModal: ConfirmModalComponent;

  confirmTitle = "Accept Selected Order?";
  confirmText =
    "No Order Selected";
  confirmOk = 'Accept Order';
  confirmCancel = 'Cancel';

  masterSelected: boolean;
  q: string = null;
  btnDisabled: boolean;

  constructor(
    router: Router,
    route: ActivatedRoute,
    private toast: ToastService,
    private orderReportService: OrderReportService,
    private orderDownloadService: OrderDownloadFileService,
    private orderService: OrderService,
    svgIconService: SvgIconService) {
      super(router, route);
      svgIconService.registerIcons();
  }

  ngOnInit() {
    super.ngOnInit();
    this.masterSelected = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!changes.checkedlist){
      this.masterSelected = false;
      this.checkUncheckAll();
    } else {
      if(changes.checkedlist.currentValue){
        this.isAllSelected();
      }
    }
  }

  ngAfterViewInit() {
    this.confirmModal.onClose.subscribe(() => this.onConfirmModalClosed());
  }


  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
      return item.isSelected == true;
    })
  }

  checkUncheckAll() {
    this.masterSelectChanged.emit(this.masterSelected);
  }

  downloadProductList(){
    this.orderReportService.downloadProductList(
      this.dateRangeValidation(this.appliedFilters),
      this.checkedlist).subscribe((response: string) => {
        this.orderDownloadService.downloadAsCsv(response, 'product-list');
    });
  }

  downloadOrderList(){
    this.orderReportService.downloadOrderList(
      this.dateRangeValidation(this.appliedFilters),
      this.checkedlist).subscribe((response: string) => {
        this.orderDownloadService.downloadAsCsv(response, 'order-list');
    });
  }

  downloadAWBBulk(){
    const formData = {
      order_numbers: this.checkedlist,
    }
    this.orderService.downloadAWBBulk(formData).subscribe((response) => {
        this.orderDownloadService.downloadAsZip(response, 'download-awb-bulk');
    });
  }

  dateRangeValidation(filters: IOrderFilterValue){
    if(moment(filters.date.end).diff(moment(filters.date.start), "days") > 14) {
      const newStartDate = moment(moment(filters.date.end).subtract(14, "days"));
      filters.date.start = newStartDate.format("YYYY-MM-DDTHH:mm:ss");
      return filters;
    }
    return filters;
  }

  actionOrder() {
    this.confirmText =
    `${this.checkedlist ? this.checkedlist.length === 1 ? 'Accept '+this.checkedlist.length +' Order' : 'Accept ' + this.checkedlist.length +' Orders at once' : this.confirmText}`;
    const filters = this.appliedFilters;
    if (
      filters.date.type === "allDate" ||
      filters.date.type === "customRange"
    ) {
      var matMenu = document.getElementsByClassName("mat-menu-panel")[0];
      let footer = document.createElement("div") as HTMLDivElement;
      footer.setAttribute("class", "download-date-range-info caption-1");

      let text = "";
      if (filters.date.type === "allDate") {
        text = "Download is limited to last 14 days.";
      } else if (filters.date.type === "customRange") {
        text = "Download is limited to last 14 days since end date.";
      }
      footer.appendChild(document.createTextNode(text));
      matMenu.appendChild(footer);
    }
  }

  onConfirmModalClosed(){
    if (this.confirmModal.result === DialogResult.OK){
      const formData = {
        order_numbers: this.checkedlist,
        order_status: 'ready'
      }

      this.orderService.postSelectedOrder(formData).subscribe(
      (resp) => {
        this.showInfoWindow(resp.successOrder);
        setTimeout(function(){
          window.location.reload();
        }, 4000);
      },
      (err) => {
        this.showErrorToast(err.error);
      }
    )};
  }

  showErrorToast(errMsg: string) {
    this.toast?.addMessage(errMsg, 'error', ToastLevelEnum.error);
  }

  showInfoWindow(resp) {
    if (resp === 0){
      this.toast?.addMessage('Only paid order or platform web and marketplace can be accepted', 'Warning', ToastLevelEnum.error);
    } else {
      this.toast?.addMessage(`${resp} order has been successfully accepted`, 'Order accepted', ToastLevelEnum.success);
    }
  }
}
