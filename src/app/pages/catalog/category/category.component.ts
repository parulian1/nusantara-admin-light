import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';

@Component({
  selector: 'nus-category',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Category">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>

<!--      <input type="hidden" [formControl]="href" name="href"> &lt;!&ndash; required for non-JSON form posting &ndash;&gt;-->

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Parent</span>
        <select [formControl]="parent" name="parent">
          <option *ngFor="let parent of parentOptions"
                  [value]="parent.href">
            {{ parent.pathName }}
          </option>
        </select>
      </label>

      <label class="checkbox" style="min-height: 1rem;">
        <input type="checkbox" [formControl]="isActive" name="isActive"> Is Active
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label class="checkbox" style="min-height: 1rem;">
        <input type="checkbox" [formControl]="isInterestedCategory" name="isInterestedCategory"> Interest Categories ?
        <nus-field-errors [control]="isInterestedCategory"></nus-field-errors>
      </label>

      <label>
        <span>Icon</span>
        <img [src]="imagePreviewUrl" alt="Category Icon" class="preview">
        <small>Recommended: 65x65</small>
        <input type="file"
               [formControl]="image"
               (change)="setIconImagePreview($event)"
               name="image"
               accept="image/*">
      </label>

      <h2>Source Mappings (optional)</h2>
      <p>
        Maps a category in your source data (such as an ERP system) to
        to this category.  These mappings are only applied once, when
        importing new data.
      </p>
      <table>
        <thead>
        <tr>
          <th>Mapping</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of sourceMappings.controls; let i=index">
          <td class="immediate-error-display">
            <input [formControl]="control" name="sourceMappings">
          </td>
          <td>
            <button (click)="removeMapping(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="button" (click)="addMapping()" class="add-button">
              Add Mapping
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
  `,
  styles: [
    'img { height: 65px; width: 65px; }',
    'input[type=file] { display: none; }',
  ]
})
export class CategoryComponent extends AbstractDetailComponent<ICategory> implements OnInit {

  parentOptions: ICategory[] = [];
  imagePreviewUrl: string;
  entity?: ICategory;

  constructor(service: CategoryService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {parentOptions: ICategory[]}) => {
      this.parentOptions = data.parentOptions;
    });
  }

  initializeForm(entity?: ICategory) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      isActive: [entity?.isActive, []],
      isInterestedCategory: [entity?.isInterestedCategory, []],
      href: [entity?.href, []],
      image: ['', []],
      parent: [{value: entity?.parent ?? null, disabled: !!entity?.href }, []],
      sourceMappings: this.fb.array([])
    });

    this.entity = entity;

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    this.setIconImagePreview(entity?.image);

    entity?.sourceMappings.forEach(
      (value) => { this.addMapping(value); }
    );
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get isInterestedCategory(): FormControl { return this.form.get('isInterestedCategory') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get sourceMappings(): FormArray { return this.form.get('sourceMappings') as FormArray; }

  setIconImagePreview(data?: Event|string) {
    super.setImagePreview(data,  (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  addMapping(value?: string) {
    this.sourceMappings.push(
      this.fb.control(value ?? '', [Validators.required, Validators.maxLength(255)])
    );
  }
  removeMapping(index: number) {
    this.sourceMappings.removeAt(index);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.image && !this.image?.value) {
      this.form.removeControl('image');
    }
    if (!!this.image && this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.image = this.imagePreviewUrl;
    }
    super.save();
  }
}
