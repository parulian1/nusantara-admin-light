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
        <span>Title</span>
        <input type="text" formControlName="title" name="title">
        <nus-field-errors [control]="form.get('title')"></nus-field-errors>
      </label>

      <label>
        <span>Image</span>
        <img [src]="imagePreviewUrl" alt="Sla Picture" class="preview">
        <small>Recommended: A size</small>
        <input type="file"
               formControlName="image"
               (change)="setPhotoPreview($event)"
               name="image"
               accept="image/*">
      </label>

      <label>
        <span>Description</span>
        <input type="text" formControlName="description" name="description">
        <nus-field-errors [control]="form.get('description')"></nus-field-errors>
      </label>

      <label>
        <span>Sort Priority</span>
        <input type="number" formControlName="sortPriority" name="sortPriority">
        <nus-field-errors [control]="form.get('sortPriority')"></nus-field-errors>
      </label>

      <label>
        <input type="checkbox" formControlName="isActive" name="isActive"> Is Active
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
    '.ck-editor__main { min-height: 150px; }',
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

    this.setPhotoPreview(entity?.image);
  }

  setPhotoPreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.image && !this.form.get('image').value) {
      this.form.removeControl('image');
    }
    if (!!this.form.get('image') && this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.image = this.imagePreviewUrl;
    }
    super.save();
  }
}
