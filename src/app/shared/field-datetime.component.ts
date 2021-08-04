/**
 * Some browser don't support widget to input datetime-local properly
 * so that we use flatpickr to handle it:
 * https://flatpickr.js.org/examples/
 */

import { FormControl } from '@angular/forms';
import { Input, Component, OnInit } from '@angular/core';

import { FlatpickrOptions } from 'ng2-flatpickr';
import * as moment from 'moment';

@Component({
  selector: 'nus-field-datetime',
  template: `
    <ng2-flatpickr
      (change)="onChange($event)"
      [config]="defaultTime"
      [formControl]="control">
    </ng2-flatpickr>
  `,
})
export class FieldDatetimeComponent implements OnInit {
  @Input() setDate: string | Date;
  @Input() control?: FormControl;
  @Input() autoFormat = true;
  @Input() minDate: string | Date;
  @Input() maxDate: string | Date;

  defaultTime: FlatpickrOptions = {
    enableTime: true,
    altInput: true,
    altFormat: 'Y/m/d, h:i K',
    defaultDate: new Date(),
  };

  /**
   * set a default date
   */
  ngOnInit(): void {
    if (this.setDate) {
      this.defaultTime.defaultDate = this.setDate;
    }

    if (this.control?.value) {
      this.defaultTime.defaultDate = this.control?.value;
    }

    if (this.minDate) {
      this.defaultTime.minDate = this.minDate;
    }

    if (this.maxDate) {
      this.defaultTime.maxDate = this.maxDate;
    }
  }

  /**
   * detect change date, and use ISO as default value
   */
  onChange(ev: any): void {
    if (this.autoFormat) {
      // try to use moment, because native new Date() returns invalid in safari
      this.control.setValue(
        moment(ev.target.value).toISOString(), { onlySelf: true }
      );
    }
  }
}
