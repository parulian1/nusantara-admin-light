import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IOption, IOrderFilter, IOrderFilterValue} from '@nusantara/models/order/filter';
import * as moment from 'moment';
import {Utils} from './utils';
import {MatSelectChange} from '@angular/material/select';
import {Logger} from '@nusantara/core';
import {MatCheckboxChange} from '@angular/material/checkbox';

const logger = new Logger('OrderFilter');

@Component({
  selector: 'nus-order-filters',
  template: `
    <form [formGroup]="filtersForm">
      <label>
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
          <mat-form-field>
            <mat-select
              [disableOptionCentering]="true"
              panelClass="mat-select-panel"
              formControlName="status"
              (selectionChange)="statusChange($event)">
              <mat-option value="" i18n>All Status</mat-option>
              <mat-option
                *ngFor="let status of orderFilter.orderStatus"
                [value]="status.option">
                {{ status.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-select [disableOptionCentering]="true"
                        panelClass="mat-select-panel"
                        formControlName="logistic"
                        (selectionChange)="logisticChange($event)">
              <mat-option value="" i18n>All Logistics</mat-option>
              <mat-option
                *ngFor="let logistic of orderFilter.logistics"
                [value]="logistic.option">
                {{ logistic.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </label>
      <label>
        <mat-checkbox formControlName="isTesting" (change)="isTestingChange($event)">
          Show Testing Order
        </mat-checkbox>
      </label>
    </form>`,
  styles: [
    'form { max-width: none }',
    '.filters { display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 16px; }',
    '.button-action { display: flex; justify-content: space-between; align-items: center; }',
    '.button-action button:not(:first-child) { margin-left: 16px; }',
    '.select-date { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px; }',
    `.svg {
      content: "";
      position: absolute;
      height: 10px;
      width: 10%;
    / / background-image: url("assets/arrow-down.svg");
      background-size: 12px;
    }`,
  ]
})
export class OrderFiltersComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<IOrderFilterValue>();
  orderStatuses: Array<IOption>;
  orderFilter: IOrderFilter;

  filtersForm: FormGroup;
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

  readonly START_TIME_PARAM = 'start_time';
  readonly END_TIME_PARAM = 'end_time';
  readonly PLATFORM_PARAM = 'store_id';
  readonly STATUS_PARAM = 'order_status_admin';
  readonly LOGISTIC_PARAM = 'shipping_method';
  readonly TESTING_PARAM = 'is_testing';

  constructor(public router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { orderStatus: IOption[]; orderFilter: IOrderFilter }) => {
        this.orderStatuses = data.orderStatus;
        this.orderFilter = data.orderFilter;
        this.orderFilter = {
          platform: [{
            option: '0',
            title: 'Web Order',
          } as IOption].concat(this.orderFilter.platform.map(vl => {
            return {option: `${vl.option}`, title: vl.title};
          })),
          orderStatus: this.orderFilter.orderStatus,
          logistics: this.orderFilter.logistics,
        } as IOrderFilter;
      }
    );

    this.initializeForm();

    this.route.queryParamMap.subscribe((value) => {
      // date
      const startTime = moment(value.get(this.START_TIME_PARAM)).isValid
        ? value.get(this.START_TIME_PARAM)
        : null;

      const endTime = moment(value.get(this.END_TIME_PARAM)).isValid
        ? value.get(this.END_TIME_PARAM)
        : null;

      const utils = new Utils();
      const dateType = utils.getDateOption(startTime, endTime);
      this.updateDate(dateType, startTime, endTime);


      const platform = value.get(this.PLATFORM_PARAM) !== null
        ? this.getValidOption(
          value.get(this.PLATFORM_PARAM),
          this.orderFilter.platform
        )
        : null;

      const status = value.get(this.STATUS_PARAM)
        ? this.getValidOption(
          value.get(this.STATUS_PARAM),
          this.orderFilter.orderStatus
        )
        : null;

      const logistic = value.get(this.LOGISTIC_PARAM)
        ? this.getValidOption(
          decodeURI(value.get(this.LOGISTIC_PARAM)),
          this.orderFilter.logistics
        )
        : null;
      const q = value.get('q') ? value.get('q') : null;

      const isTesting = moment(value.get(this.TESTING_PARAM)).isValid
        ? value.get(this.TESTING_PARAM)
        : null;


      if (platform) {
        this.updatePlatform(platform);
      }
      if (status) {
        this.updateStatus(status);
      }
      if (logistic) {
        this.updateLogistic(logistic);
      }
      if (q) {
        this.updateQuery(q);
      }
      if (!!isTesting && isTesting.toLowerCase() === 'true') {
        this.updateTesting(isTesting);
      }

      this.filtersForm.patchValue({
        platform: platform ? platform : '',
        status: status ? status : '',
        logistic: logistic ? logistic : '',
        isTesting: isTesting ? isTesting.toLowerCase() === 'true' : false,
      });

      // this.filtersForm.valueChanges.subscribe((newValue) => {
      //   this.updateRoute({
      //     [this.PLATFORM_PARAM]: newValue.platform ? newValue.platform : null,
      //     [this.STATUS_PARAM]: newValue.status ? newValue.status : null,
      //     [this.LOGISTIC_PARAM]: newValue.logistic ? newValue.logistic : null,
      //     [this.TESTING_PARAM]: newValue.isTesting ? newValue.isTesting : null
      //   });
      //
      //   this.updatePlatform(newValue.platform);
      //   this.updateStatus(newValue.status);
      //   this.updateLogistic(newValue.logistic);
      // });
    });
  }

  initializeForm() {
    this.filtersForm = this.fb.group({
      platform: new FormControl(''),
      status: new FormControl('paid'),
      logistic: new FormControl(''),
      isTesting: new FormControl(),
    });
  }

  onSelectedDateChanged(selectedDate: { type: string, startDate: string; endDate: string }) {
    if (!!selectedDate) {
      if (!!this.filtersValue.date) {
        this.filtersValue.date.type = selectedDate.type;
      }
      if (selectedDate?.startDate) {
        this.filtersValue.date.start = selectedDate.startDate;
      }
      if (selectedDate?.endDate) {
        this.filtersValue.date.end = selectedDate.startDate;
      }
    } else {
      this.filtersValue.date = null;
    }

    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      page: '1',
      start_time: selectedDate.startDate,
      end_time: selectedDate.endDate,
    });
  }

  updateRoute(params: { [x: string]: string }) {
    this.router.navigate(['.'], {
      queryParams: params,
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    }).catch(err => {
      logger.error(err);
    });
  }

  getValidOption(param: any, options: Array<IOption>) {
    const result = options.find(({option}) => option === param);
    return result ? param : '';
  }

  updateDate(type: string, startDate: string, endDate: string) {
    if (!!this.filtersValue.date) {
      this.filtersValue.date.type = type;
      this.filtersValue.date.start = startDate;
      this.filtersValue.date.end = endDate;
      this.filterApplied.next(this.filtersValue);
    }
  }

  updatePlatform(platform: number) {
    this.filtersValue.platform = platform;
    this.filterApplied.next(this.filtersValue);
  }

  updateStatus(status: string) {
    this.filtersValue.status = status;
    this.filterApplied.next(this.filtersValue);
  }

  updateLogistic(logistic: string) {
    this.filtersValue.logistic = logistic;
    this.filterApplied.next(this.filtersValue);
  }

  updateQuery(q: string) {
    this.filtersValue.q = q;
    this.filterApplied.next(this.filtersValue);
  }

  updateTesting(isTesting: string) {
    if (isTesting) {
      this.filtersValue.isTesting = isTesting;
    } else {
      this.filtersValue.isTesting = null;
    }

    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      page: '1',
      is_testing: `${isTesting}`,
    });
  }

  selectChange($event: MatSelectChange) {
    if (!!$event.value && $event.value !== '') {
      this.filtersValue.platform = $event.value;
    } else {
      this.filtersValue.platform = null;
    }
    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      page: '1',
      [this.PLATFORM_PARAM]: $event.value,
    });
  }

  statusChange($event: MatSelectChange) {
    if (!!$event.value && $event.value !== '') {
      this.filtersValue.status = $event.value;
    } else {
      this.filtersValue.status = null;
    }
    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      page: '1',
      [this.STATUS_PARAM]: $event.value,
    });
  }

  logisticChange($event: MatSelectChange) {
    if (!!$event.value && $event.value !== '') {
      this.filtersValue.logistic = $event.value;
    } else {
      this.filtersValue.logistic = null;
    }
    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      page: '1',
      [this.LOGISTIC_PARAM]: $event.value,
    });
  }

  isTestingChange($event: MatCheckboxChange) {
    this.filtersValue.isTesting = $event.checked ? 'true' : 'false';
    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      page: '1',
      [this.TESTING_PARAM]: this.filtersValue.isTesting,
    });
  }
}
