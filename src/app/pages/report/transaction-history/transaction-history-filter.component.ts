import {Component} from "@angular/core";
import {Logger} from "@nusantara/core";
import {OrderFiltersComponent} from "@nusantara/pages/fulfillment/orders";
import {TransactionHistoryReportService} from "@nusantara/services";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {IOrderFilterValue} from "@nusantara/models/order/filter";
import * as moment from "moment/moment";

const logger = new Logger('TransactionHistoryReportFilter');

@Component({
  selector: 'nus-transaction-history-report-filter',
  template: `<form [formGroup]="filtersForm">
    <label class="filter-column">
      <span i18n>Filter</span>
      <div class="filters">
        <nus-order-date-filter
          (selectedDate)="onSelectedDateChanged($event)">
        </nus-order-date-filter>
        <mat-form-field>
          <mat-select [disableOptionCentering]="true"
                      panelClass="mat-select-panel"
                      formControlName="platform"
                      (selectionChange)="selectChange($event)">
            <mat-option value="" i18n>All Platform</mat-option>
            <mat-option
              *ngFor="let platform of orderFilter.platform"
              [value]="platform.option">
              {{ platform.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </label>
    <div class="action-column">
      <button class="control" (click)="downloadOrderList()" i18n>
        <i class="material-icons">file_download</i>
        Export to .csv
      </button>
    </div>
  </form>`,
  styles: [
    'form { max-width: none; display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 16px; grid-template-areas:"filter action";}',
    '.filters { display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 16px; }',
    '.select-date { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px; }',
    '.filter-column { grid-area: filter; }',
    '.action-column { grid-area: action; display: flex; justify-content: center; align-items: center; margin-left: auto;}',
    '.action-column > button {display: flex; justify-content: flex-end; align-items: center; padding: 0 42px;}'
  ]
})
export class TransactionHistoryFilterComponent extends OrderFiltersComponent {
  filtersValue: IOrderFilterValue = {
    date: {
      type: null,
      start: null,
      end: null,
    },
    platform: null,
    status: null,
    logistic: null,
    q: null,
    isTesting: null
  };

  constructor(public router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder,
              protected transactionHistoryReportService: TransactionHistoryReportService) {
    super(router, route, fb);
  }

  dateRangeValidation(filters: IOrderFilterValue){
    console.log(filters);
    if(moment(filters.date.end).diff(moment(filters.date.start), "days") > 14) {
      const newStartDate = moment(moment(filters.date.end).subtract(14, "days"));
      filters.date.start = newStartDate.format("YYYY-MM-DDTHH:mm:ss");
      return filters;
    }
    return filters;
  }

  downloadOrderList(){
    this.transactionHistoryReportService.downloadOrderList(
      this.dateRangeValidation(this.filtersValue)).subscribe((response: string) => {
      this.transactionHistoryReportService.downloadAsCsv(response);
    });
  }
}
