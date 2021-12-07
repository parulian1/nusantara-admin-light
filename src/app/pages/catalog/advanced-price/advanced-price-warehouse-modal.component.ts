import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {IWarehouse} from '@nusantara/models';

import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult} from '@nusantara/core';

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

    button {
      min-width: 105px;
    }
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
  ) {
  }

  get warehouses(): FormArray {
    return this.form.get('warehouses') as FormArray;
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
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

  submit() {
    const v = this.formView.nativeElement.getElementsByTagName('input');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < v.length; i++) {
      if (v[i].type === 'checkbox') {
        if (v[i].checked) {
          if (this.warehouses.controls.findIndex(x => x.value === v[i].value) < 0) {
            this.warehouses.push(new FormControl(v[i].value));
          }
        } else {
          const index = this.warehouses.controls.findIndex(x => x.value === v[i].value);
          if (index >= 0) {
            this.warehouses.removeAt(index);
          }
        }
      }
    }
    this.close();
    return false;
  }

  open() {
    this.modal.open();
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    if (this.selectedWarehouses.length === 0) {
      this.warehouses.clear();
      const v = this.formView.nativeElement.getElementsByTagName('input');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < v.length; i++) {
        if (v[i].type === 'checkbox') {
          v[i].checked = false;
        }
      }
    }

    this.modal.close();
  }

  checkedItem(href) {
    return this.selectedWarehouses && (this.selectedWarehouses.value.findIndex(obj => obj.href === href) !== -1);
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      warehouses: this.fb.array([]),
    });
  }
}
