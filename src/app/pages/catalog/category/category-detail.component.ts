import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core';

@Component({
  selector: 'nus-category-detail',
  template: `
    <nus-detail-title [originalName]="originalEntityName" typeName="Category"></nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>
        <span>Name</span>
        <input type="text"
               id="name"
               formControlName="name"
               [ngClass]="{'error': name.invalid && (name.dirty || name.touched)}">
      </label>
      <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error-detail">
        <div *ngIf="name.getError('required')">This field is required</div>
      </div>

      <label class="icon-input">
        <span>Icon</span>
        <div>
          <img [src]="originalImage" *ngIf="!!originalImage">
          <input type="file"
                 formControlName="image"
                 (change)="onFileChanged($event)"
                 accept="image/*">
          <span>Recommended: 65x65px</span>
        </div>
      </label>
      <label>
        <span>Parent</span>
        <select formControlName="parent">
          <option *ngFor="let parent of parentOptions" [ngValue]="parent.href">{{parent.pathName}}</option>
        </select>
      </label>

      <h2>
        Source Mappings (optional)
        <button type="button" class="add-button" (click)="addMapping()">
          <i class="material-icons">add_circle</i>
        </button>
      </h2>
      <p>
        Maps a category in your source data (such as an ERP system) to
        to this category.  These mappings are only applied once, when
        importing new data.
      </p>
      <label>
        <div *ngFor="let control of sourceMappings.controls; let i=index">
          <input [formControl]="control">
          <button (click)="removeMapping(i)" type="button">Remove</button>
        </div>
      </label>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button (click)="navigateToParent(true)">Cancel</button>
        <button (click)="delete()" *ngIf="!isNew" class="danger">Delete</button>
      </div>
    </form>
  `,
  styles: [`
    label.icon-input { display: flex; }
    label.icon-input img { max-width: 65px; }
    label.icon-input input { display: inherit; }

    button.add-button { background: transparent; border: none; }
    label {
      display: block;
      margin-bottom: .5em;
    }
    label > span {
      display: inline-block;
      width: 65px;
    }


  `]
})
export class CategoryDetailComponent extends AbstractDetailComponent<ICategory> implements OnInit {

  public parentOptions: ICategory[] = [];
  originalImage: string;
  private newImage: File;

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
    // setup form and data
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      image: ['', []],
      parent: [{value: entity?.parent, disabled: !!entity?.href }, []],
      sourceMappings: this.fb.array([])
    });

    this.originalImage = entity?.image;

    entity?.sourceMappings.forEach(
      (value) => { this.addMapping(value); }
    );
  }

  get name() { return this.form.get('name'); }

  get sourceMappings(): FormArray {
    return this.form.get('sourceMappings') as FormArray;
  }

  addMapping(value?: string) {
    this.sourceMappings.push(
      this.fb.control(value ?? '', [Validators.required, ])
    );
  }
  removeMapping(index: number) {
    this.sourceMappings.removeAt(index);
  }

  onFileChanged(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.newImage = file;
    }
  }

  submit() {

    this.form.get('image').setValue(null);

    this.service.save(this.form.value).subscribe(
      result => {
        if (result.success) {

          if (!!this.newImage) {
            this.service.uploadImage(this.form.value, this.newImage).subscribe(
              r2 => {
                console.log('Upload image result', r2);
              }
            );

          } else {
            this.navigateToParent();
          }
        } else {
          alert('There was an error');
        }
      }
    );
  }

  delete() {
    // todo: confirm first
    this.service.delete(this.form.value);
  }

}
