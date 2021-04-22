import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import {
  ORDER_CUSTOM_DATE_FORMATS,
  DATE_DISPLAY_FORMAT,
  OrderDateAdapter,
} from "../order-date-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import * as moment from "moment";
import { ActivatedRoute } from '@angular/router';

const apiDateFormat = "YYYY-MM-DDTHH:mm:ss";

@Component({
  selector: 'nus-order-date-filter',
  template: `
  <div>
    <mat-form-field>
      <mat-select 
        [disableOptionCentering]="true" 
        panelClass="mat-select-panel" [formControl]="date" (selectionChange)="onDateOptionsSelected($event)">
        <mat-select-trigger>
          <ng-template [ngIf]="date.value === 'allDate'">
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
        <mat-option value="allDate">All Date</mat-option>
        <mat-option value="today">Today</mat-option>
        <mat-option value="yesterday">Yesterday</mat-option>
        <mat-option value="last3Days">Last 3 days</mat-option>
        <mat-option value="last7Days">Last 7 days</mat-option>
        <mat-option value="customDate" (click)="datePicker.open()">Custom Date</mat-option>
        <mat-option value="customRange" (click)="dateRangePicker.open()">Custom Range</mat-option>
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
              <span><sup>*</sup>Select up to 14 days</span>
            </mat-date-range-picker>
          </mat-form-field>
        </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-error *ngIf="date.value === 'customRange' && customRange.errors?.empty">Please select start date and end date.</mat-error>
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
export class OrderDateFilterComponent implements OnInit {
  @Output() selectedDate = new EventEmitter<{type: string, startDate: string; endDate: string}>();

  date = new FormControl("allDate");
  customDate = new FormControl();
  customRange = new FormGroup({
    start: new FormControl(''),
    end: new FormControl('')
  }, {
    validators: this.dateRangeValidator()
  });

  readonly today = this.setTimeToZero(moment());
  readonly yesterday = this.setTimeToZero(moment(moment().subtract(1, "days")));
  readonly threeDaysbefore = this.setTimeToZero(moment(moment().subtract(3, "days")));
  readonly sevenDaysbefore = this.setTimeToZero(moment(moment().subtract(7, "days")));

  constructor(public route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((value) => {
      const startTime = value.get("start_time");
      const endTime = value.get("end_time");

      if (startTime && endTime && moment(startTime).isValid && moment(endTime).isValid) {
        const selectedStartTime = moment(startTime, apiDateFormat).toDate();
        const selectedEndTime = moment(endTime, apiDateFormat).toDate();

        // today - last 7 days
        if (endTime === this.today) {
          if (startTime === this.today) {
            this.date.setValue("today");
          } else if (startTime === this.yesterday) {
            this.date.setValue("yesterday");
          } else if (startTime === this.threeDaysbefore) {
            this.date.setValue("last3Days");
          } else if (startTime === this.sevenDaysbefore) {
            this.date.setValue("last7Days");
          } else {
            this.updateDateRangeForm(selectedStartTime, selectedEndTime);
          }
        } else if (moment(endTime).diff(moment(startTime), "days") === 0) {
          this.customDate.setValue(selectedStartTime);
          this.date.setValue("customDate");
        } else {
          this.updateDateRangeForm(selectedStartTime, selectedEndTime);
        }
      }
    });
  }

  onDateOptionsSelected(event: MatSelectChange) {
    this.resetDatePicker();
    this.resetDateRangePicker();

    switch (event.value) {
      case "allDate":
        this.selectedDate.emit({type: 'allDate', startDate: null, endDate: null})
        break;
      case "today":
        this.selectedDate.emit({type: 'today', startDate: this.today, endDate: this.today})
        break;
      case "yesterday":
        this.selectedDate.emit({
          type: 'yesterday',
          startDate: this.yesterday,
          endDate: this.today,
        });
        break;
      case "last3Days":
        this.selectedDate.emit({
          type: 'last3Days',
          startDate: this.threeDaysbefore,
          endDate: this.today,
        });
        break;
      case "last7Days":
        this.selectedDate.emit({
          type: 'last7Days',
          startDate: this.sevenDaysbefore,
          endDate: this.today,
        });
        break;
      default:
        break;
    }
  }

  onCustomDateFilterChange() {
    this.selectedDate.emit({
      type: 'customDate',
      startDate: moment(this.customDate.value).format(apiDateFormat),
      endDate: moment(this.customDate.value).format(apiDateFormat)
    });
  }

  onCustomDateRangeEndChange() {
    if(this.customRange.valid){
      this.selectedDate.emit({
        type: 'customRange',
        startDate: moment(this.customRange.get('start').value).format(apiDateFormat),
        endDate: moment(this.customRange.get('end').value).format(apiDateFormat)
      });
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

  setTimeToZero(date: moment.Moment): string {
    return date
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .format(apiDateFormat);
  }

  displayMaxRangeInfo() {
    var matCalendar = document.getElementsByClassName("mat-calendar")[0];
    let footer = document.createElement("div") as HTMLDivElement;
    footer.setAttribute("class", "date-range-footer");
    const text = document.createTextNode("*Select up to 14 days");
    footer.appendChild(text);
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
}
