import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';
import { AbstractDetailComponent, IResultResponse } from '@nusantara/core';

@Component({
  selector: 'nus-category',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Category">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="saveAsForm()" #f>

      <input type="hidden" [formControl]="href" name="href"> <!-- required for non-JSON form posting -->

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
            {{parent.pathName}}
          </option>
        </select>
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
          <td class="immediate-error-display"><input [formControl]="control" name="sourceMappings"></td>
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

  @ViewChild('f') formView: ElementRef<HTMLFormElement>;

  parentOptions: ICategory[] = [];
  imagePreviewUrl: string;

  constructor(public service: CategoryService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {parentOptions: ICategory[]}) => {
      this.parentOptions = data.parentOptions;
    });
  }

  initializeForm(entity?: ICategory) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      image: ['', []],
      parent: [{value: entity?.parent, disabled: !!entity?.href }, []],
      sourceMappings: this.fb.array([])
    });

    this.setIconImagePreview(entity?.image);

    entity?.sourceMappings.forEach(
      (value) => { this.addMapping(value); }
    );
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get sourceMappings(): FormArray { return this.form.get('sourceMappings') as FormArray; }

  setIconImagePreview(data?: Event|any) {
    // if (data instanceof Event) {
    //   const file = (data.target as HTMLInputElement).files[0];
    //   this.form.get('image').setValue(file, {emitModelToViewChange: false});
    // }
    // https://www.positronx.io/how-to-use-angular-8-httpclient-to-post-formdata/
    super.setImagePreview(data,  (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  addMapping(value?: string) {
    this.sourceMappings.push(this.fb.control(value ?? '', [Validators.required, ]));
  }
  removeMapping(index: number) {
    this.sourceMappings.removeAt(index);
    if (0 === this.sourceMappings.length) {
      this.sourceMappings.setValue([]);
    }
  }
}
