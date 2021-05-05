import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption, IOrderFilter, IOrderFilterValue } from '@nusantara/models/order/filter';
import * as moment from "moment";
import { Utils } from './utils';

@Component({
  selector: 'nus-order-filters',
  template: `
    <form [formGroup]="filtersForm">
      <label>
        <span>Filter</span>
        <div class="filters">
          <nus-order-date-filter 
            (selectedDate)="onSelectedDateChanged($event)">
          </nus-order-date-filter>
          <mat-form-field>
            <mat-select [disableOptionCentering]="true" 
              panelClass="mat-select-panel" 
              formControlName="platform">
              <mat-option value="">All Platform</mat-option>
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
              formControlName="status">
              <mat-option value="">All Status</mat-option>
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
              formControlName="logistic">
              <mat-option value="">All Logistics</mat-option>
              <mat-option 
                *ngFor="let logistic of orderFilter.logistics" 
                [value]="logistic.option">
                {{ logistic.title }}
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
        // background-image: url("assets/arrow-down.svg");
        background-size: 12px; 
      }`,
  ]
})
export class OrderFiltersComponent implements OnInit {
  @Output() filterApplied =  new EventEmitter<IOrderFilterValue>();
  orderStatuses: Array<IOption>;
  orderFilter: IOrderFilter;

  filtersForm: FormGroup;
  filtersValue: IOrderFilterValue = {
    date : {
      type: null,
      start: null,
      end: null,
    },
    platform: null,
    status: null,
    logistic: null,
    q: null
  };

  readonly START_TIME_PARAM = 'start_time';
  readonly END_TIME_PARAM = 'end_time';
  readonly PLATFORM_PARAM = 'store_id';
  readonly STATUS_PARAM = 'order_status_admin';
  readonly LOGISTIC_PARAM = 'shipping_method';

  constructor(public router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { orderStatus: IOption[]; orderFilter: IOrderFilter }) => {
        this.orderStatuses = data.orderStatus;
        this.orderFilter = data.orderFilter;
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

      var utils = new Utils();
      const dateType = utils.getDateOption(startTime, endTime);
      this.updateDate(dateType, startTime, endTime);


      const platform = value.get(this.PLATFORM_PARAM)
      ? this.getValidOption(
          +value.get(this.PLATFORM_PARAM),
          this.orderFilter.platform
        )
      : null;

      const status =  value.get(this.STATUS_PARAM)
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
      const q = value.get('q')? value.get('q') : null;
  
      if(platform){
        this.updatePlatform(platform)
      }
      if(status){
        this.updateStatus(status)
      }
      if(logistic){
        this.updateLogistic(logistic)
      }
      if(q){
        this.updateQuery(q);
      }
       
      this.filtersForm.patchValue({
        platform: platform? platform : '',
        status: status? status : '',
        logistic: logistic? logistic: '',
      });

      this.filtersForm.valueChanges.subscribe((newValue) => {
        this.updateRoute({
          [this.PLATFORM_PARAM]: newValue.platform ? newValue.platform : null,
          [this.STATUS_PARAM]: newValue.status ? newValue.status : null,
          [this.LOGISTIC_PARAM]: newValue.logistic ? newValue.logistic : null,
        });

        if(newValue.platform){ this.updatePlatform(newValue.platform); }
        if(newValue.status){ this.updateStatus(newValue.status); }
        if(newValue.logistic){ this.updateLogistic(newValue.logistic); }
      });
    });
  }

  initializeForm(){
    this.filtersForm = this.fb.group({
      platform: new FormControl(''),
      status: new FormControl('paid'),
      logistic: new FormControl('')
    })
  }

  onSelectedDateChanged(selectedDate: { type: string, startDate: string; endDate: string }) {
    if(selectedDate){
      this.filtersValue.date.type = selectedDate.type;
      if(selectedDate.startDate){
        this.filtersValue.date.start = selectedDate.startDate;
      }
      if(selectedDate.endDate){
        this.filtersValue.date.end = selectedDate.startDate;
      }
    } else {
      this.filtersValue.date = null;
    }

    this.filterApplied.next(this.filtersValue);
    this.updateRoute({
      start_time: selectedDate.startDate,
      end_time: selectedDate.endDate,
    });
  }

  updateRoute(params: {[x:string]: string}){
    this.router.navigate(["."], {
      queryParams: params,
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }

  getValidOption(param: any, options: Array<IOption>) {
    const result = options.find( ({ option }) => option === param );
    return result? param : '';
  }

  updateDate(type: string, startDate: string, endDate: string) {
    this.filtersValue.date.type = type;
    this.filtersValue.date.start = startDate;
    this.filtersValue.date.end = endDate;
    this.filterApplied.next(this.filtersValue)    
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
}
