import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { IContentType } from '@nusantara/models/base';
import { IWidget } from '@nusantara/models/widgets';

@Component({
  selector: 'nus-widget-summary-row',
  template: `
    <tr [formGroup]="form" class="immediate-error-display">
      <td>{{ name.value }}</td>
      <td>{{ getWidgetTypeDisplayName }}</td>
      <td><nus-true-false [value]="isActive.value"></nus-true-false></td>
      <td></td>
    </tr>
  `,
  styles: [':host { display: contents; }']
})
export class WidgetSummaryRowComponent {

  @Input() form: FormGroup;

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get block(): FormControl { return this.form.get('block') as FormControl; }
  get objectId(): FormControl { return this.form.get('objectId') as FormControl; }
  get contentType(): FormGroup { return this.form.get('contentType') as FormGroup; }
  get contentObject(): FormGroup { return this.form.get('contentObject') as FormGroup; }

  get getWidgetTypeDisplayName() {
    const ct = this.contentType.value as IContentType;
    return ct?.model;
  }

}
