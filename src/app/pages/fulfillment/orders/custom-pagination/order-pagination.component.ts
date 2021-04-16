import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICheckedOrder } from '@nusantara/models';
import { PaginationComponent } from '@nusantara/shared/pagination.component';
import { OrderDownloadFileService, OrderReportService, SvgIconService } from '@nusantara/services';
import { IOrderFilterValue } from '@nusantara/models/order/filter';

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
          <button class="download control secondary" mat-button [matMenuTriggerFor]="menu">
            Download
            <mat-icon class="icon-secondary" svgIcon="arrow-down"></mat-icon>
          </button>
          <mat-menu #menu>
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
    '.pg-button button { border: none; background: none; height: 50px; }',
    '.pg-button { line-height: 50px; }',
    '.pg-button span { line-height: 50px; }',
    '.pg-button i { font-size: 1em; }',
  ]
})
export class OrderCustomPaginationComponent extends PaginationComponent implements OnInit, OnChanges {
  @Input() checklist: Array<ICheckedOrder>;
  @Input() checkedlist: Array<string>;
  @Input() appliedFilters: IOrderFilterValue;
  @Output() masterSelectChanged = new EventEmitter<boolean>();

  masterSelected: boolean;
  q: string = null;

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
    this.orderReportService.downloadProductList(this.appliedFilters, this.checkedlist).subscribe((response: string) => {
      this.orderDownloadService.downloadAsCsv(response, 'product-list');
    });
  }
  
  downloadOrderList(){
    this.orderReportService.downloadOrderList(this.appliedFilters, this.checkedlist).subscribe((response: string) => {
      this.orderDownloadService.downloadAsCsv(response, 'order-list');
    });
  }
}
