import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult} from '@nusantara/core';
import * as Papa from 'papaparse';
import {drf} from '@nusantara/models';

const CSV_FIELD = ['upc', 'qty', 'reason', 'sku', 'notes'];
const CSV_FIELD_DESC = {
  'upc': 'UPC',
  'qty': 'Adjusted Qty',
  'reason': 'Reason',
  'sku': 'SKU',
  'notes': 'Notes'
};


@Component({
  selector: 'nus-csv-dialog',
  template: `
    <ngx-smart-modal [identifier]="'csvDialog'" #modal [customClass]="'wide-modal'">
      <div *ngIf="currentStep == 'start'">
        <h2 class="heading-2">Choose CSV File</h2>
        <input type="file"
               name="filecsv"
               accept="text/csv"
               (change)="fileChange($event)">
        <label><input type="checkbox" [(ngModel)]="hasCsvHeader" value="1">Has header</label>
        <button class="control" (click)="currentStep = 'csvmap'">Next</button>
        <button class="control secondary ghost">Cancel</button>
      </div>
      <div *ngIf="currentStep == 'csvmap'">
        <h2 class="heading-2">Choose CSV File (2/2)</h2>
        <div>
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

          <button class="control " (click)="nextStepMap()" >Next</button>
          <button class="control secondary" (click)="currentStep = 'start'">Back</button>
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
  hasCsvHeader: any;
  availableOptions: drf.IChoice[] = [];
  column_upc: string;
  column_qty: string;
  column_reason: string;
  column_sku: string;
  column_notes: string;

  columnChoices = {
    upc: '',
    qty: '',
    reason: '',
    sku: '',
    notes: ''
  };
  fileTarget: any;

  constructor() {
  }

  ngOnInit(): void {
    for (const field of CSV_FIELD) {
      this.availableOptions.push({
        value: field,
        displayName: CSV_FIELD_DESC[field]
      });
    }
  }

  ngAfterViewInit() {
    this.modal.onOpen.subscribe(() => {

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
    const reader: FileReader = new FileReader();
    reader.readAsText(target.files[0]);

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
    reader.onerror = (err: any) => {
      alert('Unable to read ' + target.files[0].name);
    };

  }

  nextStepMap() {
    this.close();
  }
}
