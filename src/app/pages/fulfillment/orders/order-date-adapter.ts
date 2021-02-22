import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import * as moment from "moment";

export const ORDER_CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: { month: "short", year: "numeric", day: "numeric" }
  },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "short" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" }
  }
};
export const DATE_SAVE_FORMAT = "YYYY-MM-DD";
export const DATE_DISPLAY_FORMAT = "DD/MM/YYYY";

@Injectable()
export class OrderDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      return moment(date).format(DATE_SAVE_FORMAT);
    } else {
      return date.toDateString();
    }
  }
}
