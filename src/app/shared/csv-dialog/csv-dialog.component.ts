import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult, Logger} from '@nusantara/core';
import * as Papa from 'papaparse';
import {drf} from '@nusantara/models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

const CSV_FIELD = ['upc', 'qty', 'reason', 'sku', 'notes'];
const CSV_FIELD_DESC = {
  upc: 'UPC',
  qty: 'Adjusted Qty',
  reason: 'Reason',
  sku: 'SKU',
  notes: 'Notes'
};

const logger = new Logger('CSVDialogComponent');

@Component({
  selector: 'nus-csv-dialog',
  template: `
    <ngx-smart-modal [identifier]="'csvDialog'" #modal [customClass]="'wide-modal'">
      <form [formGroup]="form" class="csv-dialog-form">
        <div *ngIf="currentStep == 'start'">
          <h2 class="heading-2">Choose CSV File (Step 1/2) </h2>

          <p>Upload a CSV file to bulk upload your products. Don't have a file? <a
            href="../../../assets/sample-files/example-csv-stock-adjustment.csv" download>Download Template</a></p>

          <div>
            <!--          <form [formGroup]="form">-->
            <input type="file"
                   name="filecsv"
                   accept="text/csv,.csv"
                   (change)="fileChange($event)">
            <label>
              <input type="checkbox"
                     name="csvNoHeader"
                     [formControl]="csvNoHeader"
                     value="1" (change)="parseCsv()">My CSV has no header</label>
            <!--          </form>-->

          </div>

        </div>

        <div *ngIf="currentStep === 'mapping'">
          <h2 class="heading-2">Mapping Attribute (Step 2/2) </h2>
          <span class="file-name" *ngIf="!!fileTarget">file name : {{fileName}}</span>

          <div *ngIf="!!fileTarget">
            <table class="mapping-table">
              <thead>
              <th class="mapping-th">Bhisma Attributes</th>
              <th></th>
              <th class="mapping-th">CSV Column</th>
              </thead>
              <tbody>
              <tr>
                <td class="label-td">UPC</td>
                <td style="border: none;"></td>
                <td>
                  <div >
                    <select [formControl]="upc" (change)="selectColumn('upc', $event)">
                      <option [ngValue]="null">Select</option>
                      <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                        {{ option.displayName }}
                      </option>
                    </select>
                  </div>
                  <span *ngIf="upc.hasError('duplicate')">Can be mapped to one attribute only</span>

                </td>
              </tr>
              <tr>
                <td class="label-td">Adjusted Qty</td>
                <td style="border: none;"></td>
                <td>
                  <div>
                    <select [formControl]="qty" (change)="selectColumn('qty', $event)">
                      <option [ngValue]="null">Select</option>
                      <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                        {{ option.displayName }}
                      </option>
                    </select>
                  </div>
                  <span *ngIf="qty.hasError('duplicate')" class="error-detail">Can be mapped to one attribute only</span>
                </td>
              </tr>
              <tr>
                <td class="label-td">Reason (Optional)</td>
                <td style="border: none;"></td>
                <td>
                  <div>
                    <select [formControl]="reason" (change)="selectColumn('reason', $event)">
                      <option [ngValue]="null">Select</option>
                      <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                        {{ option.displayName }}
                      </option>
                    </select>

                  </div>
                  <span *ngIf="reason.hasError('duplicate')" class="error-detail">Can be mapped to one attribute only</span>
                </td>
              </tr>
              <tr>
                <td class="label-td">SKU</td>
                <td style="border: none;"></td>
                <td>
                  <div>
                    <select [formControl]="sku" (change)="selectColumn('sku', $event)">
                      <option [ngValue]="null">Select</option>
                      <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                        {{ option.displayName }}
                      </option>
                    </select>

                  </div>
                  <span *ngIf="sku.hasError('duplicate')" class="error-detail">Can be mapped to one attribute only</span>
                </td>
              </tr>
              <tr>
                <td class="label-td">Notes (Optional)</td>
                <td style="border: none;"></td>
                <td>
                  <div >
                    <select [formControl]="notes" (change)="selectColumn('notes', $event)">
                      <option [ngValue]="null">Select</option>
                      <option *ngFor="let option of availableOptions" [ngValue]="option.value">
                        {{ option.displayName }}
                      </option>
                    </select>

                  </div>
                  <span *ngIf="notes.hasError('duplicate')" class="error-detail">Can be mapped to one attribute only</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>
      </form>

      <div class="csv-dialog-actions">
        <button class="control" (click)="nextStepMap()" [disabled]="disabledCheck()">Next</button>
        <button class="control secondary ghost" (click)="prevStepMap()">Cancel</button>
      </div>

    </ngx-smart-modal>
  `,
  styles: [`
    .wide-modal {
      min-height: 50vh;
    }

    .csv-dialog-form {
      width: 100%;
      max-width: none;
    }

    .csv-dialog-actions button {
      margin-right: 8px;
    }

    .mapping-table {
      border: none;
      margin: 16px 0;
      table-layout: fixed;
      border-spacing: 8px;
    }

    .mapping-table tbody td {
      border-bottom: none;
      outline: none;
      padding: 0;
    }

    .mapping-table tbody td.label-td {
      border: 1px solid #B4B4B4;
      border-radius: 4px;
      outline: none;
      padding-left: 4px;
    }

    .mapping-table tbody td div {
      border: none;
      outline: none;
    }

    .mapping-table tbody td div select {
      cursor: pointer;
      border: 1px solid #B4B4B4;
      border-radius: 4px;
      outline: none;
    }

    .file-name {
      display: flex;
      color: #5A5A5A;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      margin: 8px 0;
    }

    .mapping-table th {
      background: white;
      font-weight: 400;
      font-size: 14px;
      padding: 0;
      margin: 0;
      line-height: 20px;
      color: #5a5a5a;
      vertical-align: bottom;
    }
  `]
})
export class CsvDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('modal') modal: NgxSmartModalComponent;

  result: DialogResult = DialogResult.Cancelled;
  form: FormGroup;

  currentStep = 'start';
  hasCsvHeader: any = false;
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
  columnSelected = {};
  fileTarget: any;
  fileName = '';

  constructor(protected fb: FormBuilder) {
  }

  get csvNoHeader(): FormControl {
    return this.form.get('csvNoHeader') as FormControl;
  }

  get upc(): FormControl {
    return this.form.get('upc') as FormControl;
  }

  get qty(): FormControl {
    return this.form.get('qty') as FormControl;
  }

  get reason(): FormControl {
    return this.form.get('reason') as FormControl;
  }

  get sku(): FormControl {
    return this.form.get('sku') as FormControl;
  }

  get notes(): FormControl {
    return this.form.get('notes') as FormControl;
  }

  ngOnInit(): void {
    for (const field of CSV_FIELD) {
      this.availableOptions.push({
        value: field,
        displayName: CSV_FIELD_DESC[field]
      });
    }

    this.initializeForm();
    // need to mark as touched to make custom styling works
    // this.form.controls.isActive.markAsTouched();
  }

  initializeForm() {
    this.form = this.fb.group({
      csvNoHeader: this.fb.control({value: false, disabled: true}),
      upc: this.fb.control({value: null}, [Validators.required, ]),
      qty: this.fb.control({value: null}, [Validators.required, ]),
      reason: this.fb.control({value: null}, [Validators.required, ]),
      sku: this.fb.control({value: null}, ),
      notes: this.fb.control({value: null}, ),
    });

    this.form.controls.csvNoHeader.markAsTouched();
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
    const file: File = $event.target.files[0];
    console.log('size', file.size);
    console.log('type', file.type);
    // if (file.type !== 'text/csv') {
    //   alert('File type invalid');
    //   return;
    // }
    const target: DataTransfer = $event.target as DataTransfer;
    this.fileTarget = target;
    this.fileName = $event.target.value;
    this.fileName = this.fileName.replace(/.*[\/\\]/, '');
    this.csvNoHeader.enable();
    this.hasCsvHeader = this.csvNoHeader.value === false;
    this.parseCsv();
  }

  disabledCheck() {
    if (this.currentStep === 'start') {
      if (!!this.fileTarget) {
        return false;
      }
    } else if (this.currentStep === 'mapping') {
      if (this.form.valid) {
        return false;
      }
    }

    return true;
  }

  nextStepMap() {
    if (this.currentStep === 'start' && !!this.fileTarget) {
      this.currentStep = 'mapping';
      this.hasCsvHeader = this.csvNoHeader.value === false;
      this.parseCsv();
    } else {
      this.close();
    }
  }

  prevStepMap() {
    if (this.currentStep === 'start') {
      this.fileTarget = null;
      this.csvNoHeader.setValue(false);
      this.csvNoHeader.disable();
      this.cancel();
    } else {
      this.currentStep = 'start';
      this.fileTarget = null;
      this.csvNoHeader.setValue(false);
      this.csvNoHeader.disable();
    }
  }

  parseCsv() {
    this.columnChoices = {
      upc: null,
      qty: null,
      reason: null,
      sku: null,
      notes: null
    };
    this.hasCsvHeader = this.csvNoHeader.value === false;
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

  selectColumn(index, $event) {
    const formValidate = ['upc', 'qty', 'reason', 'sku', 'notes'];
    let notValid = false;
    formValidate.filter(v => v !== index).map(v => {
      if (this.form.controls[index].value !== null) {
        if (this.form.controls[index].value === this.form.controls[v].value) {
          notValid = true;
        }
      }
    });
    if (notValid) {
      logger.debug('Value not valid has duplicate');
      this.form.controls[index].setErrors({duplicate: true});
      return;
    }
    this.columnChoices[index] = this.form.controls[index].value;
    logger.debug(this.columnChoices);

  }
}
