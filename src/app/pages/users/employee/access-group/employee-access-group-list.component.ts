import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IAccessGroup } from '@nusantara/models';

@Component({
  selector: 'nus-employee-access-group-list',
  template: `
    <tr [formGroup]="form" class="immediate-error-display">
      <td class="immediate-error-display">
        <select
          class="access-group"
          [formControl]="href"
          style="white-space: pre-wrap; max-width: 250px; text-overflow: ellipsis;"
        >
          <option [ngValue]="''" i18n>Choose Access Group</option>
          <option *ngFor="let accessGroup of choices" [ngValue]="accessGroup.href">
            {{ accessGroup.name }}
          </option>
        </select>
      </td>
      <td>
        <button
          type="button"
          class="remove-button"
          (click)="removed.emit(form)"
        >
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [':host { display: contents; }'],
})
export class EmployeeAccessGroupListComponent {
  @Input() form: FormGroup;
  @Input() choices: IAccessGroup[] = [];

  @Output() removed: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }
}
