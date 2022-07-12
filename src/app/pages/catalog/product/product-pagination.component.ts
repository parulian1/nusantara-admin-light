import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '@nusantara/shared/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductReportService } from '@nusantara/services/product-report.service';

@Component({
  selector: 'nus-product-custom-pagination',
  template:
  `
    <div class="pagination-container">
      <div class="pg-info">
        <p *ngIf="page?.totalResults > 0 && showLabels" i18n>
          Showing <strong>{{ startingIndex }}-{{ endingIndex }}</strong>
          of
          <strong>{{ page?.totalResults }}</strong>
        </p>
      </div>
      <div class="pg-action">
        <div>
          <button class="control secondary" (click)="downloadProductList()" i18n>Download</button>
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
    '.pg-button button { border: none; background: none; height: 50px; }',
    '.pg-button { line-height: 50px; }',
    '.pg-button span { line-height: 50px; }',
    '.pg-button i { font-size: 1em; }',
  ]
})
export class ProductPaginationComponent extends PaginationComponent {
  constructor(router: Router,
              route: ActivatedRoute,
              private productReportService: ProductReportService) {
    super(router, route);
  }

  downloadProductList(){
    this.productReportService.downloadProductList().subscribe((response: string) => {
      this.productReportService.downloadAsCsv(response);
    });
  }
}
