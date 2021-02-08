import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PagedResponse } from '../core/pagination';
import { PaginationComponent } from '@nusantara/shared/pagination.component';


@Component({
  selector: 'nus-pagination-child',
  template: `
    <div class="pagination-container">
      <div class="pg-info">
        <p *ngIf="page?.totalResults > 0 && showLabels">
          Showing <strong>{{ startingIndex }}-{{ endingIndex }}</strong>
          of
          <strong>{{ page?.totalResults }}</strong>
        </p>
      </div>
      <div class="pg-button">
        <button (click)="goBack()" type="button"><i class="material-icons">arrow_back_ios</i></button>
        <span><strong>{{ page?.pageNumber }}</strong> / <strong>{{ page.maximumPageCount }}</strong></span>
        <button (click)="goNext()" type="button"><i class="material-icons">arrow_forward_ios</i></button>
      </div>
    </div>
  `,
  styles: [
    '.pagination-container { display: flex; justify-content: space-between; align-items: center; }',
    '.pg-info { color: #464646; text-align: left; width: 60%; }',
    '.pg-button button { border: none; background: none; height: 50px; }',
    '.pg-button { line-height: 50px; }',
    '.pg-button span { line-height: 50px; }',
    '.pg-button i { font-size: 1em; }'
  ]
})
export class PaginationChildComponent extends PaginationComponent {

  @Input() showLabels = true;
  @Input() page: PagedResponse<any>;
  @Output() fetchPageNumber = new EventEmitter<number>();

  changePage(value: number) {
    if (value !== this.currentPage) {
      this.fetchPageNumber.emit(value);
    }
  }
}
