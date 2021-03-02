import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IWarehouse } from '@nusantara/models';

@Component({
  selector: 'nus-employee-warehouse-list',
  template: `
    <tr [formGroup]="form" class="immediate-error-display">
      <td class="immediate-error-display">
        <select
          class="warehouse select-warehouse"
          (change)="changeWarehouse($event)"
          [formControl]="href"
        >
          <option [ngValue]="''">Choose warehouse</option>
          <option *ngFor="let warehouse of choices" [ngValue]="warehouse.href">
            <span *ngIf="!warehouse?.isActive">(In-Active)</span>
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
  styles: [
    ':host { display: contents; }',
    `
      .select-warehouse {
        white-space: pre;
        width: 300px;
        text-overflow: ellipsis;
        -webkit-appearance: none;
      }
    `
  ],
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
