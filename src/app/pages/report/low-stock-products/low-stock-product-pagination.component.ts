import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PagedResponse } from '@nusantara/core';

@Component({
  selector: 'nus-low-stock-product-pagination',
  template: `
    <div class="pagination-container">
      <div class="pg-info">
        <div>
          <p *ngIf="page?.totalResults > 0 && showLabels" i18n>
            Showing <strong>{{ startingIndex }}-{{ endingIndex }}</strong>
            of
            <strong>{{ page?.totalResults }}</strong>
          </p>
        </div>
        <div *ngIf="updatedDate !== ''" class="updated-date-info">
          <p class="body-2" i18n>
            Last Updated : {{ updatedDate | date: 'dd/MMM/yyyy HH:mm a' }}
          </p>
        </div>
      </div>
      <div class="pg-button">
        <button (click)="goBack()" *ngIf="currentPage > 1"><i class="material-icons">arrow_back_ios</i></button>
        <span><strong>{{ page?.pageNumber }}</strong> / <strong>{{ page.maximumPageCount }}</strong></span>
        <button (click)="goNext()" *ngIf="page.maximumPageCount !== currentPage"><i class="material-icons">arrow_forward_ios</i></button>
      </div>
    </div>

  `,
  styles: [
    '.pagination-container { display: flex; justify-content: space-between; align-items: center; }',
    '.pg-info { color: #464646; text-align: left; display: flex; justify-content: flex-start; align-items: center; gap: 29px; }',
    '.pg-button button { border: none; background: none; height: 50px; }',
    '.pg-button { line-height: 50px; }',
    '.pg-button span { line-height: 50px; }',
    '.pg-button i { font-size: 1em; }',
    '.updated-date-info { background-color: var(--alert); border-radius: 4px; padding: 4px 8px;}',
    '.updated-date-info > p { margin: 0; color: var(--lighten-black); }'
  ]
})

export class LowStockProductPaginationComponent {

  @Input() showLabels = true;
  @Input() page: PagedResponse<any>;
  @Input() updatedDate: string = '';
  @Output() updatePage = new EventEmitter<number>();

  constructor() {
    // do nothing
  }

  get currentPage(): number {
    return this.page?.pageNumber || 1;
  }

  get startingIndex(): number {
    if (!!this.page) {
      return ((this.page.pageNumber - 1) * this.page.pageSize) + 1;
    }
    return 0;
  }

  get endingIndex(): number {
    if (!!this.page) {
      return this.startingIndex + this.page.entities.length - 1;
    }
    return 0;
  }

  get canGoBack(): boolean {
    if (!!this.page) {
      return !!this.page.linkHeaders?.filter(lh => lh.rel === 'prev' || lh.rel === 'previous').length;
    }
    return false;
  }

  get canGoNext(): boolean {
    if (!!this.page) {
      return !!this.page.linkHeaders?.filter(lh => lh.rel === 'next').length;
    }
    return false;
  }

  changePage(value: number) {
    if (value !== this.currentPage) {
      this.updatePage.emit(value);
    }
  }

  goBack(): void {
    if (this.canGoBack) {
      this.changePage(this.currentPage - 1);
    }
  }

  goNext(): void {
    if (this.canGoNext) {
      this.changePage(this.currentPage + 1);
    }
  }
}
