import {Component, DoCheck, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import { AbstractEditingComponent, moveItemInFormArray } from '@nusantara/core';
import { FormArray, FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOnBoarding, IOnboardingContent } from '@nusantara/models';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OnboardingContentComponent } from './onboarding-content.component';

@Component({
  selector: 'nus-onboarding-content-host',
  template: `
    <div cdkDropList [cdkDropListData]="form" class="example-list"
         (cdkDropListDropped)="drop($event)">
      <div class="onboarding-content-div" *ngFor="let content_control of form.controls; let i=index" cdkDrag>
        <nus-onboarding-content [form]="content_control"
                                [entity]="retrieveEntity(content_control, i)"
                                (remove)="form.removeAt(i)">
        </nus-onboarding-content>
      </div>
      <button type="button" (click)="addContent()" class="add-button">
        <i class="material-icons">add</i> Add New Popup
      </button>
    </div>
    <form [formGroup]="formButton" *ngIf="form.controls.length" >
      <div class="action-button-box">
        <label>
          <span>Button Status</span>
          <input type="checkbox" [formControl]="buttonStatus" (change)="setAvailabilityAndClearValueButtonProp()">
        </label>

        <label>
          <span>Button Text</span>
          <input type="url" [formControl]="buttonText">
          <nus-field-errors [control]="buttonText"></nus-field-errors>
        </label>

        <label>
          <span>Button Url</span>
          <input type="url" [formControl]="buttonUrl">
          <nus-field-errors [control]="buttonUrl"></nus-field-errors>
        </label>
      </div>
    </form>
  `,
  styleUrls: ['./onboarding-content-host.css']
})
export class OnboardingContentHostComponent extends AbstractEditingComponent<FormArray> implements OnInit, DoCheck {
  @Input() form: FormArray;
  @Input() entity: IOnBoarding;
  formButton: FormGroup;

  @ViewChildren(OnboardingContentComponent) contents!: QueryList<OnboardingContentComponent>;

  constructor(public route: ActivatedRoute,
              public fb: FormBuilder,
              public router: Router) {
    super();
  }

  ngOnInit() {
    this.initFormButton();
  }

  ngDoCheck() {
    this.clearErrors();
  }

  initFormButton(): void {
    const lastIndexValues = this.getFormLastIndex(this.form);
    this.formButton = this.fb.group({
      buttonStatus: [lastIndexValues?.get('buttonStatus')?.value ?? false, []],
      buttonText: [lastIndexValues?.get('buttonText')?.value ?? null, [Validators.maxLength(100)]],
      buttonUrl: [lastIndexValues?.get('buttonUrl')?.value ?? null, [Validators.maxLength(160)]],
    });
    this.buttonStatus.markAsTouched();
  }

  addContent(content?: IOnboardingContent) {
    const form = this.fb.group({
      href: [content?.href ?? '', []],
      image: ['', content?.image ? [] : [Validators.required]],
      name: [content?.name, [Validators.required, Validators.maxLength(100)]],
      description: [content?.description, [Validators.maxLength(255), Validators.required]],
      buttonStatus: [content?.buttonStatus ?? false, []],
      buttonText: [content?.buttonText ?? '', [Validators.maxLength(100)]],
      buttonUrl: [content?.buttonUrl ?? '', [Validators.maxLength(160)]],
      sortPriority: [content?.sortPriority, []],
    });
    if (!this.form.controls.length) {
      this.initFormButton();
    }
    this.form.push(form);
  }

  get buttonStatus(): FormControl {
    return this.formButton?.get('buttonStatus') as FormControl;
  }

  get buttonText(): FormControl {
    return this.formButton?.get('buttonText') as FormControl;
  }

  get buttonUrl(): FormControl {
    return this.formButton?.get('buttonUrl') as FormControl;
  }

  drop(event: CdkDragDrop<FormArray, any>) {
    moveItemInFormArray(
      this.form,
      event.previousIndex,
      event.currentIndex
    );
  }

  setAvailabilityAndClearValueButtonProp() {
    const buttonTextValidators = [Validators.maxLength(100)];
    const buttonUrlValidators = [Validators.maxLength(160)];
    if (!!this.buttonStatus) {
      if (this.buttonStatus.value === true) {
        this.buttonText.enable();
        this.buttonUrl.enable();
        buttonTextValidators.push(Validators.required);
        buttonUrlValidators.push(Validators.required);
      } else {
        this.buttonText.patchValue(null);
        this.buttonUrl.patchValue(null);
        this.buttonText.disable();
        this.buttonUrl.disable();
      }
      this.buttonText.setValidators(buttonTextValidators);
      this.buttonUrl.setValidators(buttonUrlValidators);
      this.buttonText.updateValueAndValidity();
      this.buttonUrl.updateValueAndValidity();
    }
  }

  getValue() {
    const controlsLength = this.form.controls.length;

    if (!!controlsLength) {
      this.form.at(controlsLength - 1).get('buttonStatus').setValue(this.buttonStatus?.value);
      this.form.at(controlsLength - 1).get('buttonText').setValue(this.buttonText?.value);
      this.form.at(controlsLength - 1).get('buttonUrl').setValue(this.buttonUrl?.value);
    }

    let formValues = this.form.value;
    formValues.map((formValue, index) => {
      formValue['sortPriority'] = index;
      formValue['image'] = this.contents.get(index).imagePreviewUrl;
      if (index < controlsLength - 1 && controlsLength > 1) {
        formValue['buttonStatus'] = false;
        formValue['buttonText'] = '';
        formValue['buttonUrl'] = '';
      }
    });


    return formValues;
  }

  getFormLastIndex(form: FormArray) {
    let lastIndex = 0;
    if (form.controls.length > 1) {
      lastIndex = form.controls.length - 1;
    }
    return this.form.at(lastIndex);
  }

  retrieveEntity(contentControl: AbstractControl, index: number): any{
    if (contentControl.value?.href) {
      return this.entity.contents[index];
    } else {
      return null;
    }
  }

  clearErrors(): void {
    const isButtonStatusValid = !!this.buttonStatus?.value;
    const isButtonTextValid = !!this.buttonText?.value && this.buttonText?.value.length;
    const isButtonUrlValid = !!this.buttonUrl?.value && this.buttonUrl?.value.length;
    const isFormValid = this.form.length > 0;
    if (isButtonStatusValid && isButtonTextValid && isButtonUrlValid && isFormValid) {
      this.form.setErrors(null);
    }
  }
}
