import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { ToastService, AbstractDetailComponent } from '@nusantara/core';
import { ISla } from '@nusantara/models';
import { SlaService } from '@nusantara/services';

@Component({
  selector: 'nus-flat-page',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Page">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>Title</span>
        <input type="text" formControlName="title" name="title">
        <nus-field-errors [control]="form.get('title')"></nus-field-errors>
      </label>

      <label>
        <span i18n>Image</span>
        <img [src]="imagePreviewUrl" alt="Sla Picture" class="preview">
        <small i18n>Recommended: A size</small>
        <input type="file"
               formControlName="image"
               (change)="setPhotoPreview($event)"
               name="image"
               accept="image/*">
      </label>

      <label>
        <span i18n>Description</span>
        <input type="text" formControlName="description" name="description">
        <nus-field-errors [control]="form.get('description')"></nus-field-errors>
      </label>

      <label>
        <span i18n>Sort Priority</span>
        <input type="number" formControlName="sortPriority" name="sortPriority">
        <nus-field-errors [control]="form.get('sortPriority')"></nus-field-errors>
      </label>

      <label class="checkbox">
        <input type="checkbox" formControlName="isActive" name="isActive" i18n> Is Active
        <nus-field-errors [control]="form.get('isActive')"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    '.ck-editor__main { min-height: 150px; }'
  ]
})
export class SlaComponent extends AbstractDetailComponent<ISla> implements OnInit {
  imagePreviewUrl: string;
  entity?: ISla;

  constructor(service: SlaService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  initializeForm(entity?: ISla) {
    this.form = this.fb.group({
      title: [entity?.title, [Validators.required]],
      href: [entity?.href],
      description: [entity?.description],
      image: ['', entity?.image ? [] : [Validators.required]],
      isActive: [entity?.isActive ?? true],
      sortPriority: [entity?.sortPriority ?? 0, [Validators.required, Validators.min(0)]],
    });

    this.entity = entity;

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    this.setPhotoPreview(entity?.image);
  }

  setPhotoPreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  getFormValue(): any {
    let formValue = {...this.form.value};
    formValue = this.formImageValue(formValue);
    return formValue;
  }

  /**
   * handle image in form when create / update instance.
   */
  formImageValue(formValue: any, fieldName= 'image'): void {
    delete formValue[fieldName];

    if (this.entity) {
      if (this.imagePreviewUrl !== this.entity.image) {
        formValue =  {...formValue, [fieldName]: this.imagePreviewUrl};
      }
    } else {
      if (this.imagePreviewUrl) {
        formValue = {...formValue, [fieldName]: this.imagePreviewUrl};
      }
    }

    return formValue;
  }
}
