import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICheckedOrder } from '@nusantara/models';
import { PaginationComponent } from '@nusantara/shared/pagination.component';
import { OrderDownloadFileService, OrderReportService, SvgIconService } from '@nusantara/services';
import { IOrderFilterValue } from '@nusantara/models/order/filter';
import * as moment from 'moment';

@Component({
  selector: 'nus-order-custom-pagination',
  template: `
    <div class="pagination-container">
      <div class="pg-info">
        <span *ngIf="page?.totalResults > 0 && showLabels">
          <mat-checkbox [(ngModel)]="masterSelected"
          (change)="checkUncheckAll()"> 
            Selected <strong>{{checkedlist? checkedlist.length: 0 }}/{{ page.entities.length }} </strong>
          </mat-checkbox>
          of<strong> {{ page?.totalResults }}</strong>
        </span>
      </div>
      <div class="pg-action">
        <div>
          <button 
            class="download control secondary"
            mat-button
            [matMenuTriggerFor]="downloadMenu"
            (menuOpened)="displayDownloadDateRangeInfo()">
              Download
            <mat-icon class="icon-secondary" svgIcon="arrow-down"></mat-icon>
          </button>
          <mat-menu #downloadMenu>
            <button mat-menu-item (click)="downloadProductList()">Product List</button>
            <!-- <button mat-menu-item>Shipping Label</button> -->
            <button mat-menu-item (click)="downloadOrderList()">Order List</button>
          </mat-menu>
        </div>
        <div class="pg-button">
          <button (click)="goBack()" *ngIf="currentPage > 1"><i class="material-icons">arrow_back_ios</i></button>
          <span><strong>{{ page?.pageNumber }}</strong> / <strong>{{ page.maximumPageCount }}</strong></span>
          <button (click)="goNext()" *ngIf="page.maximumPageCount !== currentPage"><i class="material-icons">arrow_forward_ios</i></button>
        </div>
      </div>
    </div>
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
    '::ng-deep .mat-menu-panel{min-width: 200px !important; }'
  ]
})
export class OrderCustomPaginationComponent extends PaginationComponent implements OnInit, OnChanges {
  @Input() checklist: Array<ICheckedOrder>;
  @Input() checkedlist: Array<string>;
  @Input() appliedFilters: IOrderFilterValue;
  @Output() masterSelectChanged = new EventEmitter<boolean>();

  masterSelected: boolean;
  q: string = null;
  btnDisabled: boolean;

  constructor(
    router: Router, 
    route: ActivatedRoute,
    private orderReportService: OrderReportService,
    private orderDownloadService: OrderDownloadFileService,
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

  dateRangeValidation(filters: IOrderFilterValue){
    if(moment(filters.date.end).diff(moment(filters.date.start), "days") > 14) {
      const newEndDate = moment(moment(filters.date.start).add(14, "days"));
      filters.date.end = newEndDate.format("YYYY-MM-DDTHH:mm:ss"); 
      return filters;
    }
    return filters;
  }

  displayDownloadDateRangeInfo() {
    const filters = this.appliedFilters;
    if (
      filters.date.type === "allDate" ||
      filters.date.type === "customRange"
    ) {
      var matMenu = document.getElementsByClassName("mat-menu-panel")[0];
      let footer = document.createElement("div") as HTMLDivElement;
      footer.setAttribute("class", "download-date-range-info caption-1")

      let text = "";
      if (filters.date.type === "allDate") {
        text = "*Download is limited to last 14 days.";
      } else if (filters.date.type === "customRange") {
        text = "*Download is limited to last 14 days since end date.";
      }
      footer.appendChild(document.createTextNode(text));
      matMenu.appendChild(footer);
    }
  }
}
