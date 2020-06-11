import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IVendor } from '@nusantara/models';
import { VendorService } from '@nusantara/services';
import { SuccessCreatedResult } from '@nusantara/core/responses';

@Component({
  selector: 'nus-vendor-detail',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span>Name</span>
        <input type="text" formControlName="name">

      </label>

      <label>
        <span>Description</span>
        <textarea formControlName="description"></textarea>
      </label>

      <label>
        <span>Icon Image</span>
        <img [src]="iconUrl" id="icon-image-preview">
        <input type="file" (change)="onFileChanged($event, 'iconFile')">
        <small>Recommended 120px x 120px (1:1)</small>
      </label>

      <label>
        <span>Banner Image</span>
        <img [src]="bannerUrl" id="banner-image-preview">
        <input type="file" (change)="onFileChanged($event, 'bannerFile')">
        <small>Recommended: 1152px x 350px (16:5)</small>
      </label>

      <label>
        <span>Internal Notes</span>
        <textarea formControlName="internalNotes"></textarea>
      </label>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button type="button" (click)="navigateToParent(true)">Cancel</button>
        <button type="button" (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [`
    img { background-color: var(--nav-background); }
    #icon-image-preview {
      height:120px; width: 120px; object-fit: scale-down;
    }
    #banner-image-preview {
      height:125px;
      width: 400px;
      object-fit: scale-down;
    }
  `]
})
export class VendorDetailComponent extends AbstractDetailComponent implements OnInit {

  iconUrl: string;
  bannerUrl: string;
  files = {iconImage: null, bannerImage: null};

  constructor(public service: VendorService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder,
              public toast: ToastService) {
    super();
  }

  get hasImagesToUpload(): boolean {
    return !!this.files.bannerImage || !!this.files.iconImage;
  }

  set iconFile(value: File) {
    this.files.iconImage = value;
    const reader = new FileReader();
    reader.onload = (ev) => this.iconUrl = reader.result as string;
    reader.readAsDataURL(value);
  }

  set bannerFile(value: File) {
    this.files.bannerImage = value;
    const reader = new FileReader();
    reader.onload = (ev) => this.bannerUrl = reader.result as string;
    reader.readAsDataURL(value);
  }

  // called when a file changes
  onFileChanged(event: Event, targetPropertyName: string) {
    // bug in typescript: https://github.com/microsoft/TypeScript/issues/31816
    const target = event.target as HTMLInputElement;
    if (target.files.length > 0) {
      this[targetPropertyName] = target.files[0];
    }
  }

  save() {
    const entity = this.form.value as IVendor;

    this.service.save(this.form.value).subscribe(
      resp => {
        if (resp.success) {

          if (!this.files.bannerImage) { delete this.files.bannerImage; }
          if (!this.files.iconImage) { delete this.files.iconImage; }

          if (this.hasImagesToUpload) {
            return this.service.uploadImages(
              entity.href ?? (resp as SuccessCreatedResult).href,
              this.files
            ).subscribe(r2 => {
              if (r2.success) {
                this.onSaveSuccess();
              } else {
                this.onSaveError();
              }
            });
          } else {
            this.onSaveSuccess();
          }
        } else {
          this.onSaveError();
        }
      }
    );
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: {entity: IVendor}) => {
      this.form = this.fb.group({
        name: [data.entity?.name, [Validators.required, ]],
        href: [data.entity?.href, []],
        description: [data.entity?.description ?? '', []],
        internalNotes: [data.entity?.internalNotes ?? '', []],
      });

      this.iconUrl = data.entity?.iconImage ?? '/assets/no-image_id.png';
      this.bannerUrl = data.entity?.bannerImage ?? '/assets/no-image_id.png';

      this.originalEntityName = data.entity?.name;
    });
  }

}
