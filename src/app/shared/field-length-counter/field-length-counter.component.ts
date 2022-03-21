import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'nus-field-length-counter',
  template: `
    <ng-container *ngIf="control?.touched || control?.value?.length>0" >
      <span [class.error-detail]="(!!maxLength && control?.value?.length>maxLength)" class="error-text">
        ({{control?.value?.length}}<ng-container *ngIf="!!maxLength">/{{maxLength}}</ng-container>)</span>
    </ng-container>
  `,
  styles: [
    `
    :host {
      font-size: 10px;
    }
    `
  ]
})
export class FieldLengthCounterComponent  {
  @Input() control?: FormControl;
  @Input() maxLength: number;
  @Input() asError = false;

  constructor() { }

}
