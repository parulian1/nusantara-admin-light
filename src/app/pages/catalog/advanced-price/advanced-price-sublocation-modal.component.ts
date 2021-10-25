import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { IWarehouse } from '@nusantara/models';

import { NgxSmartModalComponent } from 'ngx-smart-modal';
import {DialogResult} from "@nusantara/core";

@Component({
  selector: 'nus-advanced-price-sublocation-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectProduct'" #modal [formGroup]="form" [customClass]="'wide-modal'">
      <h2 class="title-2">Select Location</h2>
      <form #modalForm class="fluid" (ngSubmit)="submit()">
        <table class="warehouse-table">
          <thead>
          <tr>
            <th class="subheading-2 warehouse-table__name">
              <label class="checkbox">
                <input type="checkbox">
                <span>Warehouse Name</span>
              </label>
            </th>
            <th>
              <span class="subheading-2">Location Name</span>
            </th>
            <th>
              <span class="subheading-2">Location Type</span>
            </th>
          </tr>
          </thead>
          <tbody>
          <ng-container *ngFor="let choice of choices">
            <tr *ngFor="let loc of choice.wh_location">
              <td class="warehouse-table__name">
                <label class="checkbox">
                  <input
                    type="checkbox"
                    [value]="loc.href"
                    (change)="onCheckboxChange($event)"
                  >
                  <span>{{ choice.wh_name }}</span>
                </label>
              </td>
              <td>{{ loc.name }}</td>
              <td>{{ loc.type }}</td>
            </tr>
          </ng-container>
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
export class AdvancedPriceSublocationModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;
  @Input() choices: Array<any> = [];
  @Input() selectedSubLocations: FormArray = new FormArray([]);

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;

  constructor(
    private fb: FormBuilder,
  ) {}

  get location(): FormArray {
    return this.form.get('location') as FormArray;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.selectedSubLocations.value.forEach((loc) => {
        this.location.push(new FormControl(loc.href));
      });
    });
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      location: this.fb.array([]),
    });
  }

  onCheckboxChange(e) {
    if (e.target.checked) {
      this.location.push(new FormControl(e.target.value));
    } else {
      const index = this.location.controls.findIndex(x => x.value === e.target.value);
      this.location.removeAt(index);
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
}
