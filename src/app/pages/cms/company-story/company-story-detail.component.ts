import { Component, OnInit } from '@angular/core';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { ICompanyStory } from '@nusantara/models';
import { CompanyStoryService } from '@nusantara/services';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-company-story-list',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Company Story">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Title</span>
        <input type="text" [formControl]="name" name="title">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Description</span>
        <input type="text" [formControl]="description" name="description">
        <nus-field-errors [control]="description"></nus-field-errors>
      </label>

      <label class="checkbox">
        <input type="checkbox" [formControl]="isActive" name="isActive"> Is Active
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label>
        <span>Image</span>
        <img [src]="imageData.base64 || imageData.url" alt="Company Story Picture" class="preview">
        <small>Recommended: A size</small>
        <input type="file"
               [formControl]="image"
               (change)="setImageFromEvent($event)"
               name="image"
               accept="image/*">
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [``]
})
export class CompanyStoryDetailComponent extends AbstractDetailComponent<ICompanyStory> implements OnInit {
  constructor(
    service: CompanyStoryService,
    public fb: FormBuilder,
    toast: ToastService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router, toast, service);
  }

  imageData = {
    base64: '',
    url: '',
    isUpdated: false,
  };
  entity: ICompanyStory;

  setImage(data: string, isUrl = false): void {
    if (isUrl) {
      this.imageData.url = data;
    } else {
      this.imageData.base64 = data;
    }
  }
  setImageFromEvent(data?: Event | string): void {
    super.setImagePreview(data, (dataAsUrl) => {
      this.imageData.base64 = dataAsUrl;
      this.imageData.isUpdated = true;
    });
  }

  initializeForm(entity?: ICompanyStory) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href],
      description: [entity?.description, [Validators.maxLength(255)]],
      image: ['', []],
      isActive: [entity?.isActive ?? true, []],
    });

    this.entity = entity;

    // need to mark as touched to make custom styling works
    this.isActive.markAsTouched();
    this.setImage(this.entity?.image ?? '');
  }

  getFormValue(): any {
    const form = super.getFormValue();

    if (this.entity) { delete form.image; }
    if (this.imageData.isUpdated) { form.image = this.imageData.base64; }
    return form;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }
  get image(): FormControl {
    return this.form.get('image') as FormControl;
  }
  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }
}
