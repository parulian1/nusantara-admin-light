import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { IWarehouse } from '@nusantara/models';

import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { DialogResult } from '@nusantara/core';

@Component({
  selector: 'nus-advanced-price-warehouse-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectProduct'" #modal [formGroup]="form" [customClass]="'wide-modal'">
      <h2 class="title-2">Select Warehouse</h2>
      <form #modalForm class="fluid" (ngSubmit)="submit()">
        <table class="warehouse-table">
          <thead>
          <tr>
            <th class="subheading-2 warehouse-table__name">
              <label class="checkbox">
                <input type="checkbox">
                <span>Name</span>
              </label>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let choice of choices">
            <td class="warehouse-table__name">
              <label class="checkbox">
                <input
                  type="checkbox"
                  name="{{ choice.href }}"
                  [value]="choice.href"
                  [checked]="checkedItem(choice.href)"
                  (change)="onCheckboxChange($event)"
                >
                <span>{{ choice.name }}</span>
              </label>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="actions-container">
          <button type="submit" [disabled]="!form.valid" class="control">
            Submit
          </button>
          <button type="button" (click)="cancel()" class="control secondary ghost">
            Cancel
          </button>
        </div>
      </form>
    </ngx-smart-modal>
  `,
  styles: [`
    .warehouse-table {
      margin-top: 16px;
    }
    .warehouse-table__name > label {
      min-height: fit-content;
      padding-bottom: 0;
    }
    .actions-container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      margin-top: 1.5em;
    }
    .actions-container > button {
      width: 48%;
    }
    button { min-width: 105px; }
  `]
})
export class AdvancedPriceWarehouseModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;
  @Input() choices: Array<IWarehouse> = [];
  @Input() selectedWarehouses: FormArray = new FormArray([]);

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;

  constructor(
    private fb: FormBuilder,
  ) {}

  get warehouses(): FormArray {
    return this.form.get('warehouses') as FormArray;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.selectedWarehouses.value.forEach((wh) => {
        this.warehouses.push(new FormControl(wh.href));
      });
    });
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      warehouses: this.fb.array([]),
    });
  }

  onCheckboxChange(e) {
    if (e.target.checked) {
      this.warehouses.push(new FormControl(e.target.value));
    } else {
      const index = this.warehouses.controls.findIndex(x => x.value === e.target.value);
      this.warehouses.removeAt(index);
    }
  }

  submit() {
    this.close();
    return false;
  }

  open() {
    this.modal.open();
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }

  checkedItem(href) {
    if (this.selectedWarehouses && ( -1 !== this.selectedWarehouses.value.findIndex(obj => obj.href === href) )) {
      return 'checked';
    }
    return '';
  }
}
