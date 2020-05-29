import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResponse } from '@nusantara/core/pagination';

@Component({
    selector: 'nus-pagination',
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
                <button (click)="goBack()"
                        [disabled]="!canGoBack"><i class="material-icons">arrow_back_ios</i></button>
                <span>{{ page?.pageNumber }} / {{ page.maximumPageCount }}</span>
                <button (click)="goNext()"
                        [disabled]="!canGoNext"><i class="material-icons">arrow_forward_ios</i></button>
            </div>
        </div>`,
    styles: [
      '.pagination-container { display: flex; justify-content: space-between; }',
      '.pg-info { color: #464646; text-align: left; width: 60%; }',
      '.pg-button button { border: none; background: none; height: 50px; }',
      '.pg-button { line-height: 50px; }',
      '.pg-button span { line-height: 50px; }',
      '.pg-button i { font-size: 1em; }'
      ]
})

export class PaginationComponent implements OnInit {


    @Input() showLabels = true;
    @Input() page: PagedResponse<any>;
    currentPage = 1;
    startingIndex = 0;
    endingIndex = 0;
    canGoBack = false;
    canGoNext = false;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
      this.currentPage = this.page?.pageNumber;
      this.startingIndex = ((this.page.pageNumber - 1) * this.page.pageSize) + 1;
      this.endingIndex = this.startingIndex + this.page.entities.length - 1;
      this.canGoBack = !!this.page.linkHeaders?.filter(lh => lh.rel === 'prev' || lh.rel === 'previous').length;
      this.canGoNext = !!this.page.linkHeaders?.filter(lh => lh.rel === 'next').length;
    }

    changePage(value: number) {
      if (value !== this.currentPage) {
        this.router.navigate(
          [],
          {
            queryParams: {page: value},
            queryParamsHandling: 'merge',
            relativeTo: this.activatedRoute,
            replaceUrl: true,
          });
      }
    }

    goBack(): void {
        if (this.canGoBack) {
            this.changePage(this.currentPage - 1);
        }
    }

    goNext(): void {
        if (this.canGoNext) {
          this.changePage(this.currentPage + 1)
        }
    }
}
