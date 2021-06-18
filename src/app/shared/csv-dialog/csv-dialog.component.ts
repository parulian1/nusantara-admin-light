import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult} from '@nusantara/core';
import * as Papa from 'papaparse';
import {drf} from '@nusantara/models';
import {FormBuilder} from '@angular/forms';

const CSV_FIELD = ['upc', 'qty', 'reason', 'sku', 'notes'];
const CSV_FIELD_DESC = {
  upc: 'UPC',
  qty: 'Adjusted Qty',
  reason: 'Reason',
  sku: 'SKU',
  notes: 'Notes'
};


@Component({
  selector: 'nus-csv-dialog',
  template: `
    <ngx-smart-modal [identifier]="'csvDialog'" #modal [customClass]="'wide-modal'">
      <div *ngIf="currentStep == 'start'">

        <h2 class="heading-2">Choose CSV File</h2>
        <div>
          <input type="file"
                 name="filecsv"
                 accept="text/csv"
                 (change)="fileChange($event)">
          <label><input type="checkbox"
                        [(ngModel)]="hasCsvHeader"
                        value="1" (change)="parseCsv()">Has header</label>

        </div>
        <div *ngIf="!!fileTarget">
          <table>
            <tr>
              <td>UPC</td>
              <td>
                <select [(ngModel)]="columnChoices['upc']">
                  <option [ngValue]="null">Select</option>
                  <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                    {{ option.displayName }}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Adjusted Qty</td>
              <td>
                <select [(ngModel)]="columnChoices['qty']">
                  <option [ngValue]="null">Select</option>
                  <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                    {{ option.displayName }}
                  </option>
                </select></td>
            </tr>
            <tr>
              <td>Reason</td>
              <td>
                <select [(ngModel)]="columnChoices['reason']">
                  <option [ngValue]="null">Select</option>
                  <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                    {{ option.displayName }}
                  </option>
                </select></td>
            </tr>
            <tr>
              <td>SKU</td>
              <td><select [(ngModel)]="columnChoices['sku']">
                <option [ngValue]="null">Select</option>
                <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                  {{ option.displayName }}
                </option>
              </select></td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>
                <select [(ngModel)]="columnChoices['notes']">
                  <option [ngValue]="null">Select</option>
                  <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                    {{ option.displayName }}
                  </option>
                </select></td>
            </tr>
          </table>
        </div>
        <div>
          <button class="control" (click)="nextStepMap()">Next</button>
          <button class="control secondary ghost">Cancel</button>
        </div>

      </div>
    </ngx-smart-modal>
  `,
  styles: [
    `
      .wide-modal {
        min-height: 50vh;
      }`
  ]
})
export class CsvDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('modal') modal: NgxSmartModalComponent;

  result: DialogResult = DialogResult.Cancelled;

  currentStep = 'start';
  hasCsvHeader: any = true;
  availableOptions: drf.IChoice[] = [];
  // tslint:disable-next-line:variable-name
  column_upc: string;
  // tslint:disable-next-line:variable-name
  column_qty: string;
  // tslint:disable-next-line:variable-name
  column_reason: string;
  // tslint:disable-next-line:variable-name
  column_sku: string;
  // tslint:disable-next-line:variable-name
  column_notes: string;

  columnChoices = {
    upc: '',
    qty: '',
    reason: '',
    sku: '',
    notes: ''
  };
  fileTarget: any;

  constructor(protected fb: FormBuilder, ) {
  }

  ngOnInit(): void {
    for (const field of CSV_FIELD) {
      this.availableOptions.push({
        value: field,
        displayName: CSV_FIELD_DESC[field]
      });
    }
    // need to mark as touched to make custom styling works
    // this.form.controls.isActive.markAsTouched();
  }

  ngAfterViewInit() {
    this.modal.onOpen.subscribe(() => {
      this.result = DialogResult.Cancelled;
    });
    this.modal.onClose.subscribe(() => {

    });
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

  fileChange($event: any) {
    const target: DataTransfer = $event.target as DataTransfer;
    this.fileTarget = target;
    this.parseCsv();
  }

  nextStepMap() {
    this.close();
  }

  parseCsv() {
    this.columnChoices = {
      upc: null,
      qty: null,
      reason: null,
      sku: null,
      notes: null
    };
    const reader: FileReader = new FileReader();
    reader.readAsText(this.fileTarget.files[0]);

    reader.onload = (event: any) => {
      const csvData = event.target.result;
      const data = Papa.parse(csvData, {header: this.hasCsvHeader, preview: 5});
      if (this.hasCsvHeader) {
        this.availableOptions = [];
        for (const theField of data.meta.fields) {

          this.availableOptions.push({
            value: theField,
            displayName: theField + ` (${data.data[0][theField]})`
          });
        }
      } else {
        this.availableOptions = [];
        let i = 0;
        for (const theField of data.data[0]) {
          i++;
          this.availableOptions.push({
            value: i.toString(10),
            displayName: `Column ${i.toString(10)} (${theField})`
          });
        }
      }
    };
    reader.onloadend = (event: any) => {
      // this.currentStep = 'csvmap';
    };
    reader.onerror = (err: any) => {
      alert('Unable to read ' + this.fileTarget.files[0].name);
    };
  }
}
