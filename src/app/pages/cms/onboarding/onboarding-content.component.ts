import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AbstractEditingComponent } from '@nusantara/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOnboardingContent } from '@nusantara/models';

@Component({
  selector: 'nus-onboarding-content',
  template: `
    <form [formGroup]="form" #f>
      <div class="onboarding-content-page">
        <div class="onboarding-content-title">
          <div class="title">
            <div>
              <img src="/assets/drag.svg" style="width: 18px; float: left; padding-right: 10px; padding-top: 9px;">
              <input type="text" [formControl]="name" style="background-color: transparent;">
              <div class="collapse" (click)="toggle()">
                <img src="/assets/arrow-down.svg">
              </div>
            </div>
            <nus-field-errors [control]="name"></nus-field-errors>
          </div>
        </div>
        <div  class="onboarding-content" *ngIf="show">
          <label>
            <span i18n>Image</span>
            <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
            <input type="file" [formControl]="image" (change)="setImagePreview($event)"
                 name="icon" accept="image/*">
            <nus-onboarding-content-image></nus-onboarding-content-image>
          </label>

          <label>
            <span i18n>Description</span>
            <textarea [formControl]="description"></textarea>
            <nus-field-errors [control]="description"></nus-field-errors>
          </label>

          <input type="hidden" [formControl]="buttonStatus">
          <input type="hidden" [formControl]="buttonText">
          <input type="hidden" [formControl]="buttonUrl">

          <input type="number" hidden [formControl]="sortPriority" min="0">
          <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button"
            style="min-height: 32px;border: 2px solid #B4B4B4;box-sizing: border-box;border-radius: 4px;min-width: 120px;float: right;" i18n>
            Delete
          </button>
        </div>
      </div>
    </form>
  `,
  styles: [
    `
      .onboarding-content-page {
        border: 1px solid #E0E0E0;
        border-radius: 8px 8px 0px 0px;
      }
      .onboarding-content-title {
        background: #E4E4E4;
        border: 1px solid #E0E0E0;
        box-sizing: border-box;
        overflow: hidden;
        padding: 10px;
        border-radius: 8px 8px 0px 0px;
      }
      .title {
        position: relative;
      }
      .onboarding-content-title .title input[type=text] {
        float: left;
        width: 92%;
      }
      .onboarding-content {
        background: #FFFFFF;
        border-bottom: 1px solid #E0E0E0;
        box-sizing: border-box;
        padding: 10px 24px;
        overflow: hidden;
      }
      div.collapse > img {
        max-height: 10px;
        max-width: 10px;
        object-fit: contain;
      }
      .collapse {
        position: absolute;
        right: 0;
        top: 10px;
      }
      img.preview {
        max-height: 300px;
        max-width: 100%;
        object-fit: contain;
      }
      ::ng-deep .nsm-content {
        background-color: #fff;
        width: inherit;
      }
      ::ng-deep .nsm-dialog {
        max-width: 600px;
      }
    `
  ]
})
export class OnboardingContentComponent extends AbstractEditingComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() entity: IOnboardingContent;
  @Output() remove = new EventEmitter<void>();
  imagePreviewUrl: string;
  show = true;

  constructor(public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit() {
    this.setImagePreview(this.entity?.image);
  }

  get href(): FormControl { return this.form.get('href') as FormControl; }
  get name(): FormControl { return this.form.get('name') as FormControl; }
  get buttonStatus(): FormControl { return this.form.get('buttonStatus') as FormControl; }
  get buttonText(): FormControl { return this.form.get('buttonText') as FormControl; }
  get buttonUrl(): FormControl { return this.form.get('buttonUrl') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }

  setImagePreview(data: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => {
      this.imagePreviewUrl = dataAsUrl;
    });
  }

  getValue() {
    return this.form.value;
  }

  toggle() {
    this.show = !this.show;
    return this.show;
  }

}
