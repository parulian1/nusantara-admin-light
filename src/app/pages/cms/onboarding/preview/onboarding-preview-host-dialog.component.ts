import {AbstractEditingComponent, DialogResult} from '@nusantara/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from "ngx-smart-modal";

@Component({
  selector: 'nus-onboarding-preview-host-dialog',
  template: `
    <ngx-smart-modal [customClass]="'content-container'" [identifier]="'onboardingPreviewHostDialogModal'" #modal
                     *ngIf="!!form">
        <div class="content-header">

        </div>
        <div class="content-body">
          <div class="content-value">
            <h1>
                {{ getContentName(form.controls[startIndex]) }}
            </h1>
            <label>
              {{ getContentDescription(form.controls[startIndex] )}}
            </label>
          </div>
          <div class="slider">
            <input type="radio" name="slider-radio" *ngFor="let formControl of form.controls; let i=index"
                   [value]="i" [checked]="i === startIndex" [disabled]="true">
          </div>
          <div class="action-button">
            <button (click)="next()" type="button" class="control secondary">Selanjutnya</button>
          </div>
        </div>
    </ngx-smart-modal>
  `,
  styles: [`

    .content-header {
      background: #00AEEF;
      height: 152px;
      background: #00AEEF;
      border-radius: 24px 24px 0px 0px;
      padding: 10px;
    }

    .content-body {
      background: #FFFFFF;
      padding: 20px;
      border-radius: 0px 0px 24px 24px;
      height: 361px;
    }

    .content-body div {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    ::ng-deep .nsm-content{
      background: none;
      box-shadow: none;
      width: 800px;
     }

    .slider input {
      width: 30px;
    }

    ::ng-deep .nsm-dialog {
      max-width: 800px;
    }

    ::ng-deep .nsm-dialog-btn-close {
      top: 25px;
      right: 30px;
    }

  `]
})
export class OnboardingPreviewHostDialogComponent extends AbstractEditingComponent<FormArray> implements OnInit,
  AfterViewInit
{
  @Input() form: FormArray;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  imagePreviewUrl: string;
  result: DialogResult;
  startIndex = 0;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.result = DialogResult.Cancelled;
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

  getContentName(formGroup?: AbstractControl) : string {
    if (!!formGroup) {
      return formGroup.get('name').value;
    }
    return '';
  }

  getContentDescription(formGroup?: AbstractControl) : string {
    if (!!formGroup) {
      return formGroup.get('description').value;
    }
    return '';
  }

  next() {
    if (this.startIndex < (this.form.controls.length - 1)) {
      this.startIndex += 1;
    }
  }


}
