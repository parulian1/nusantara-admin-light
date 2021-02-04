import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IWarehouse } from '@nusantara/models';

@Component({
  selector: 'nus-employee-warehouse-list',
  template: `
    <tr [formGroup]="form" class="immediate-error-display">
      <td class="immediate-error-display">
        <select
          class="warehouse"
          (change)="changeWarehouse($event)"
          [formControl]="href"
          style="white-space: pre-wrap; max-width: 250px; text-overflow: ellipsis;"
        >
          <option [ngValue]="''">Choose warehouse</option>
          <option *ngFor="let warehouse of choices" [ngValue]="warehouse.href">
            {{ warehouse.code }} - {{ warehouse.name }}
          </option>
        </select>
        <!--  employee -> (many) warhouses -->
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
export class EmployeeWarehouseListComponent {
  @Input() form: FormGroup;
  @Input() choices: IWarehouse[] = [];

  @Output() removed: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  changeWarehouse(e: any): void {}
}
