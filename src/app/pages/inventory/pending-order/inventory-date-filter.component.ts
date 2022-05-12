import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import {
  ORDER_CUSTOM_DATE_FORMATS,
  DATE_DISPLAY_FORMAT,
  OrderDateAdapter,
} from "../../fulfillment/orders/order-date-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import * as moment from "moment";
import { ActivatedRoute } from '@angular/router';
import { Utils } from './utils';
import { until } from 'selenium-webdriver';

const apiDateFormat = "YYYY-MM-DDTHH:mm:ss";

@Component({
  selector: 'nus-order-date-filter',
  template: `
  <div>
    <mat-form-field appearance="outline">
      <mat-select #select="matSelect"
        [disableOptionCentering]="true"
        panelClass="mat-select-panel" [formControl]="date"
        (selectionChange)="onDateOptionsSelected($event)">
        <mat-select-trigger>
          <ng-template [ngIf]="date.value === 'allDate'" i18n>
            All Date
          </ng-template>
          <ng-template [ngIf]="date.value === 'today'">
            {{ showDisplayDate(dateFromNow()) }}
          </ng-template>
          <ng-template [ngIf]="date.value === 'yesterday'">
            {{ showDisplayDate(dateFromNow(-1)) }}
          </ng-template>
          <ng-template [ngIf]="date.value === 'last3Days'">
            {{ showDisplayDate(dateFromNow(-3)) }}
            -
            {{ showDisplayDate(dateFromNow()) }}
          </ng-template>
          <ng-template [ngIf]="date.value === 'last7Days'">
            {{ showDisplayDate(dateFromNow(-7)) }}
            -
            {{ showDisplayDate(dateFromNow()) }}
          </ng-template>
          <ng-template [ngIf]="date.value === 'customDate'">
            {{ customDate.value ? showDisplayDate(customDate.value) : '' }}
          </ng-template>
          <ng-template [ngIf]="date.value === 'customRange'">
            {{ customRange.get('start').value ? showDisplayDate(customRange.get('start').value) : '' }}
            -
            {{ customRange.get('end').value ? showDisplayDate(customRange.get('end').value) : '' }}
          </ng-template>
        </mat-select-trigger>
        <mat-option value="allDate" i18n>All Date</mat-option>
        <mat-option value="today" i18n>Today</mat-option>
        <mat-option value="yesterday" i18n>Yesterday</mat-option>
        <mat-option value="last3Days" i18n>Last 3 days</mat-option>
        <mat-option value="last7Days" i18n>Last 7 days</mat-option>
        <mat-option value="customDate" (click)="datePicker.open()" i18n>Custom Date</mat-option>
        <mat-option value="customRange" (click)="dateRangePicker.open()" i18n>Custom Range</mat-option>
        <mat-option class="custom-date-filter">
          <mat-form-field>
            <input matInput (dateChange)="onCustomDateFilterChange()"
              [formControl]="customDate"
              [matDatepicker]="datePicker"
            />
            <mat-datepicker-toggle matSuffix [for]="datePicker">
            </mat-datepicker-toggle>
            <mat-datepicker touchUi #datePicker></mat-datepicker>
          </mat-form-field>
        </mat-option>
        <mat-option class="custom-date-filter">
          <mat-form-field>
            <mat-date-range-input
              [formGroup]="customRange"
              [rangePicker]="dateRangePicker">
              <input matStartDate formControlName="start"/>
              <input
                (dateChange)="onCustomDateRangeEndChange()"
                matEndDate formControlName="end"/>
            </mat-date-range-input>
            <mat-datepicker-toggle
              matSuffix
              [for]="dateRangePicker">
            </mat-datepicker-toggle>
            <mat-date-range-picker touchUi #dateRangePicker (opened)="displayMaxRangeInfo()">
            </mat-date-range-picker>
          </mat-form-field>
        </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-error *ngIf="date.value === 'customRange' && customRange.errors?.empty" i18n>Please select start date and end date.</mat-error>
  </div>
  `,
  styles: [
    '.select-date { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px; }',
    `.svg {
        content: "";
        position: absolute;
        height: 10px;
        width: 10%;
        background-image: url("assets/arrow-down.svg");
        background-size: 12px;
      }`,
    '.custom-date-filter { display: none; }',
    '::ng-deep .mat-calendar .mat-button-wrapper { color: var(--lighten-black); font-weight: bold; }'
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: ORDER_CUSTOM_DATE_FORMATS },
    { provide: DateAdapter, useClass: OrderDateAdapter },
  ],
})
export class InventoryDateFilterComponent implements OnInit {
  @Output() selectedDate = new EventEmitter<{type: string, startDate: string; endDate: string}>();
  @ViewChild('select') select: MatSelect;

  date = new FormControl("allDate");
  customDate = new FormControl();
  customRange = new FormGroup({
    start: new FormControl(''),
    end: new FormControl('')
  }, {
    validators: this.dateRangeValidator()
  });

  startTime: string;
  endTime: string;

  utils = new Utils();
  today: string;
  endday:string;
  yesterday: string;
  threeDaysbefore: string;
  sevenDaysbefore: string

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.today = this.utils.today;
    this.endday = this.utils.endDay
    this.yesterday = this.utils.yesterday;
    this.threeDaysbefore = this.utils.threeDaysbefore;
    this.sevenDaysbefore = this.utils.sevenDaysbefore;


    this.route.queryParamMap.subscribe((value) => {
      this.startTime = value.get("start_date");
      this.endTime = value.get("end_date");

      if (this.startTime && this.endTime && moment(this.startTime).isValid && moment(this.endTime).isValid) {
        const selectedStartTime = moment(this.startTime, apiDateFormat).toDate();
        const selectedEndTime = moment(this.endTime, apiDateFormat).toDate();


        switch(this.utils.getDateOption(this.startTime, this.endTime)){
          case "today":
            this.date.setValue("today");
            break;
          case "yesterday":
            this.date.setValue("yesterday");
            break;
          case "last3Days":
            this.date.setValue("last3Days");
            break;
          case "last7Days":
            this.date.setValue("last7Days");
            break;
          case "customDate":
            this.customDate.setValue(selectedStartTime);
            this.date.setValue("customDate");
            break;
          case "customRange":
            this.updateDateRangeForm(selectedStartTime, selectedEndTime);
            break;
          default:
            break;
        }
      }
    });
  }

  onDateOptionsSelected(event) {
    this.resetDatePicker();
    this.resetDateRangePicker();
    switch (event.value) {
      case "allDate":
        this.updateSelectedDate("allDate", null, null);
        break;
      case "today":
        this.updateSelectedDate("today", this.today, this.endday);
        break;
      case "yesterday":
        this.updateSelectedDate("yesterday", this.yesterday, this.endday);
        break;
      case "last3Days":
        this.updateSelectedDate("last3Days", this.threeDaysbefore, this.endday);
        break;
      case "last7Days":
        this.updateSelectedDate("last7Days", this.sevenDaysbefore, this.endday);
        break;
      default:
        break;
    }
  }

  onCustomDateFilterChange() {
    this.updateSelectedDate(
      "customDate",
      moment(this.customDate.value).format(apiDateFormat),
      this.utils.setTimeEndDay(moment(this.customDate.value))
    );
  }

  onCustomDateRangeEndChange() {
    if(this.customRange.valid){
      this.updateSelectedDate(
        "customRange",
        moment(this.customRange.get('start').value).format(apiDateFormat),
        this.utils.setTimeEndDay(moment(this.customRange.get('end').value))
      );
    }
  }

  showDisplayDate(date: Date): string {
    return moment(date).format(DATE_DISPLAY_FORMAT);
  }

  dateFromNow(accumulator = 0) {
    const date = new Date();
    date.setDate(date.getDate() + accumulator);
    return date;
  }

  dateRangeValidator() {
    return (fg: FormGroup) => {
      const start = fg.get("start").value;
      const end = fg.get("end").value;

      if (start === null || end === null) {
        return { empty: true };
      }
    };
  }

  displayMaxRangeInfo() {
    var matCalendar = document.getElementsByClassName("mat-calendar")[0];
    let footer = document.createElement("div") as HTMLDivElement;
    footer.setAttribute("class", "date-range-footer");
    matCalendar.appendChild(footer);
  }

  resetDatePicker(){
    this.customDate.reset();
  }

  resetDateRangePicker(){
    this.customRange.reset();
  }

  updateDateRangeForm(start: Date, end: Date){
    this.customRange.controls.start.setValue(start);
    this.customRange.controls.end.setValue(end);
    this.date.setValue("customRange");
  }

  updateSelectedDate(type: string, startDate: string, endDate: string){
    this.selectedDate.emit({
      type: type,
      startDate: startDate,
      endDate: endDate
    });
  }
}
