import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {UserPointService} from '@nusantara/services/user-point.service';
import {ICustomer} from '@nusantara/models';
import {IPointHistory} from "@nusantara/models/point-history";
import {PagedResponse} from "@nusantara/core";

@Component({
  selector: 'nus-customer-point-modal',
  template: `
    <ngx-smart-modal [identifier]="'pointHistory'" #modal [customClass]="'wide-modal'">
      <h2 class="heading-2" i18n>Point History</h2>
      <section class="customer-point-modal__summary">
        <div id="customer-total-point">
          <img src="assets/point-icon.svg" alt="Profile Image">
          <span i18n>{{ pointTotal | number }} Point</span>
        </div>
      </section>
      <section class="customer-point-modal__history">
        <table>
          <thead>
          <tr style="background-color: #F4F4F4;">
            <th class="point-information" i18n>Information</th>
            <th class="point-date" i18n>Date</th>
            <th class="point-amount" i18n>Points</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let p of pointHistory?.entities">
            <td class="point-information">{{ p.info }} #{{ p.orderNumber }}</td>
            <td class="point-date">{{ p.date|date }}</td>
            <td class="point-amount">{{ p.pointValue|number }}</td>
          </tr>
          <tr *ngIf="pointHistory?.totalResults === 0">
            <td colspan="3" style="text-align: center;" i18n>No point history</td>
          </tr>
          </tbody>
        </table>
      </section>
      <div class="pagination-container" *ngIf="pointHistory?.totalResults > 0">
        <div class="pg-info">
          <p *ngIf="pointHistory?.totalResults > 0" i18n>
            Showing <strong>{{ startingIndex }}-{{ endingIndex }}</strong>
            of
            <strong>{{ pointHistory?.totalResults }}</strong>
          </p>
        </div>
        <div class="pg-button">
          <button (click)="goBack()" *ngIf="currentPage > 1" type="button">
            <i class="material-icons">arrow_back_ios</i>
          </button>
          <span><strong>{{ pointHistory?.pageNumber }}</strong> / <strong>{{ pointHistory.maximumPageCount }}</strong></span>
          <button (click)="goNext()" *ngIf="pointHistory.maximumPageCount !== currentPage" type="button">
            <i class="material-icons">arrow_forward_ios</i>
          </button>
        </div>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { padding-bottom: 16px }',
    'p { color : var(--darken-grey); margin-bottom: 16px; }',
    'table { table-layout: fixed }',
    'td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    `
      .customer-point-modal__summary {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 14px;
        border: 1px solid #B4B4B4;
        box-sizing: border-box;
        border-radius: 4px;
        margin-bottom: 16px;
      }

      .customer-point-modal__summary span {
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
      }

      #customer-total-point {
        display: flex;
      }

      #customer-total-point img {
        margin-inline-end: 8px;
      }

      .customer-point-modal__history {
        max-height: 100vh;
        overflow: auto;
      }

      .point-information {
        width: 50%;
      }

      .point-date, .point-amount {
        text-align: right;
      }
    `,
    '.pagination-container { display: flex; justify-content: space-between; align-items: center; }',
    '.pg-info { color: #464646; text-align: left; width: 60%; }',
    '.pg-button button { border: none; background: none; height: 50px; }',
    '.pg-button { line-height: 50px; }',
    '.pg-button span { line-height: 50px; }',
    '.pg-button i { font-size: 1em; }'
  ]
})
export class CustomerPointModalComponent implements AfterViewInit {
  @Input() entity?: ICustomer;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  constructor(protected service: UserPointService) {}

  pointTotal: number;
  pointHistory: PagedResponse<IPointHistory>;

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.service.fetchByUser(this.entity?.username).subscribe((result) => {
        if (result && result?.total) {
          this.pointTotal = result?.total;
        } else {
          this.pointTotal = 0;
        }
      });
      this.service.fetchHistory(this.entity?.username).subscribe((result) => {
        this.pointHistory = result;
      });
    });
  }

  open() {
    this.modal.open();
  }

  get currentPage(): number {
    return this.pointHistory?.pageNumber || 1;
  }

  get startingIndex(): number {
    if (!!this.pointHistory) {
      return ((this.pointHistory.pageNumber - 1) * this.pointHistory.pageSize) + 1;
    }
    return 0;
  }

  get endingIndex(): number {
    if (!!this.pointHistory) {
      return this.startingIndex + this.pointHistory.entities.length - 1;
    }
    return 0;
  }

  get canGoBack(): boolean {
    if (!!this.pointHistory) {
      return !!this.pointHistory.linkHeaders?.filter(lh => lh.rel === 'prev' || lh.rel === 'previous').length;
    }
    return false;
  }

  get canGoNext(): boolean {
    if (!!this.pointHistory) {
      return !!this.pointHistory.linkHeaders?.filter(lh => lh.rel === 'next').length;
    }
    return false;
  }

  changePage(value: number) {
    if (value !== this.currentPage) {
      this.service.fetchHistory(this.entity?.username, value).subscribe((result) => {
        this.pointHistory = result;
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
      this.changePage(this.currentPage + 1);
    }
  }
}
