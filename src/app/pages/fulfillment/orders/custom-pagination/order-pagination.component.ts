import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { ICheckedOrder } from '@nusantara/models';
import { PaginationComponent } from '@nusantara/shared/pagination.component';

const ARROW_DOWN = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.30453 8.84377L12.0769 12.7502L15.9634 8.97745L17.1226 10.1779L12.0361 15.0898L7.12412 10.0033L8.30453 8.84377Z"/>
</svg>
`;

@Component({
  selector: 'nus-order-custom-pagination',
  template: `
    <div class="pagination-container">
      <div class="pg-info">
        <span *ngIf="page?.totalResults > 0 && showLabels">
          <mat-checkbox [(ngModel)]="masterSelected"
          (change)="checkUncheckAll()"> 
            Selected <strong>{{checkedList? checkedList.length: 0 }}/{{ page.entities.length }} </strong>
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
            <button mat-menu-item>Product List</button>
            <button mat-menu-item>Shopping Label</button>
            <button mat-menu-item>Order List</button>
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
  @Input() checkedList: Array<ICheckedOrder>;
  @Output() masterSelectChanged = new EventEmitter<boolean>();

  masterSelected: boolean;

  constructor(
    router: Router, 
    route: ActivatedRoute,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer) { 
      super(router, route); 
      iconRegistry.addSvgIconLiteral('arrow-down', sanitizer.bypassSecurityTrustHtml(ARROW_DOWN));
  }

  ngOnInit() {
    this.masterSelected = false;
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!changes.checkedList){
      this.masterSelected = false;
      this.checkUncheckAll();
    } else {
      if(changes.checkedList.currentValue){
        console.log(
          changes.checkedList.currentValue.map(
            (item: ICheckedOrder) => item.order.orderNumber
          )
        );
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
}
