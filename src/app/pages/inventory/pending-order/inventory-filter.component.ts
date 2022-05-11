import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IOption, IOrderFilter, IOrderFilterValue} from '@nusantara/models/order/filter';
import * as moment from 'moment';
import {Utils} from '../../fulfillment/orders/header/utils';
import {MatSelectChange} from '@angular/material/select';
import {Logger} from '@nusantara/core';

const logger = new Logger('OrderFilter');

@Component({
  selector: 'nus-inventory-filters',
  template: `
    <form [formGroup]="filtersForm">
      <label>
        <span i18n>Filter</span>
        <div class="filters">
          <nus-order-date-filter
            (selectedDate)="onSelectedDateChanged($event)">
          </nus-order-date-filter>
          <mat-form-field appearance="outline">
            <mat-select
              [disableOptionCentering]="true"
              panelClass="mat-select-panel"
              formControlName="status"
              (selectionChange)="statusChange($event)">
              <mat-option
              *ngFor="let s of status"
              [value]="s.value">
                {{s.label}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-select [disableOptionCentering]="true"
                        panelClass="mat-select-panel"
                        formControlName="type"
                        (selectionChange)="typeChange($event)">
              <mat-option
              *ngFor="let t of type"
              [value]="t.value">
                {{t.label}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
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
export class InventoryFiltersComponent implements OnInit {
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

  status = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Approved', value: 'approved' },
  ];

  type = [
    { label: 'All Type', value: '' },
    { label: 'Delivery', value: 'receiving_order' },
    { label: 'Adjusment', value: 'adjustment_order' },
    { label: 'Transfer', value: 'transfer_order' },
  ];

  readonly START_TIME_PARAM = 'start_date';
  readonly END_TIME_PARAM = 'end_date';
  readonly STATUS_PARAM = 'receiving_status';
  readonly TYPE_PARAM = 'receiving_type';

  constructor(public router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initializeForm();

    this.route.queryParamMap.subscribe((value) => {
      const startTime = moment(value.get(this.START_TIME_PARAM)).isValid
        ? value.get(this.START_TIME_PARAM)
        : null;

      const endTime = moment(value.get(this.END_TIME_PARAM)).isValid
        ? value.get(this.END_TIME_PARAM)
        : null;

      const utils = new Utils();
      const dateType = utils.getDateOption(startTime, endTime);
      console.log(dateType)
      this.updateDate(dateType, startTime, endTime);

      const status = value.get(this.STATUS_PARAM)
        ? this.getValidOption(
          value.get(this.STATUS_PARAM),
          this.status
        )
        : null;

      const type = value.get(this.TYPE_PARAM)
        ? this.getValidOption(
          decodeURI(value.get(this.TYPE_PARAM)),
          this.type
        )
        : null;

      if (status) {
        this.updateStatus(status);
      }
      if (type) {
        this.updateType(type);
      }

      this.filtersForm.patchValue({
        status: status ? status : '',
        type: type ? type : '',
      });

      this.filtersForm.valueChanges.subscribe((newValue) => {
        this.updateRoute({
          [this.STATUS_PARAM]: newValue.status ? newValue.status : null,
          [this.TYPE_PARAM]: newValue.type ? newValue.type : null,
        });
        this.updateStatus(newValue.status);
        this.updateType(newValue.type);
      });
    });
  }

  initializeForm() {
    this.filtersForm = this.fb.group({
      status: this.status[0].value,
      type: this.type[0].value,
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
      start_date: selectedDate.startDate,
      end_date: selectedDate.endDate,
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

  getValidOption(param: any, options: any) {
    const result = []
    options.forEach(el => {
      if(el.value === param){
        result.push(el)
      }
    });
    console.log(result)

    return result.length > 0 ? param : '';
  }

  updateDate(type: string, startDate: string, endDate: string) {
    if (!!this.filtersValue.date) {
      this.filtersValue.date.type = type;
      this.filtersValue.date.start = startDate;
      this.filtersValue.date.end = endDate;
      this.filterApplied.next(this.filtersValue);
    }
  }

  updateStatus(status: string) {
    this.filtersValue.status = status;
    this.filterApplied.next(this.filtersValue);
  }

  updateType(logistic: string) {
    this.filtersValue.logistic = logistic;
    this.filterApplied.next(this.filtersValue);
  }

  updateQuery(q: string) {
    this.filtersValue.q = q;
    this.filterApplied.next(this.filtersValue);
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

  typeChange($event: MatSelectChange) {
    if (!!$event.value && $event.value !== '') {
      this.filtersValue.logistic = $event.value;
    } else {
      this.filtersValue.logistic = null;
    }
    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      page: '1',
      [this.TYPE_PARAM]: $event.value,
    });
  }
}
