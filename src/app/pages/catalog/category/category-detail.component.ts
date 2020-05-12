import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core';

@Component({
  selector: 'nus-category-detail',
  template: `
    <nus-detail-title [originalName]="entityName" typeName="Category">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>
        <span>Name</span>
        <input type="text" formControlName="name" required>
      </label>
      <label>
        <span>Icon</span>
        <input type="file" formControlName="icon" required>
      </label>
      <label>
        <span>Parent</span>
        <select formControlName="parent">
          <option *ngFor="let parent of parentOptions" [ngValue]="parent.href">{{parent.pathName}}</option>
        </select>
      </label>

      <h3>Source Mappings (optional) <button type="button" (click)="addMapping()">Add</button></h3>
      <label>
        Source Mappings (optional)
        <div *ngFor="let control of sourceMappings.controls; index as i">
          <input [formControl]="sourceMappings.controls[i]">
        </div>
      </label>
      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button (click)="navigateToParent(true)">Cancel</button>
        <button (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [`
    label {
      display: block;
      margin-bottom: .5em;
    }
    label > span {
      display: inline-block;
      width: 65px;
    }
    input {
      font-size: 1em;
      font-family: Roboto, "Helvetica Neue", sans-serif;
    }

  `]
})
export class CategoryDetailComponent extends AbstractDetailComponent implements OnInit {

  public entityName: string;

  // tracks the original value of the object (probably not necessary unless using template-driven forms)
  public entity: ICategory;

  public parentOptions: ICategory[] = [];


  constructor(public service: CategoryService,
              public route: ActivatedRoute,
              public router: Router,
              private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: {entity: ICategory, parentOptions: ICategory[]}) => {
      this.form = this.fb.group({
        name: [data.entity?.name, [Validators.required, ]],
        href: [data.entity?.href, []],
        icon: [data.entity?.image, []],
        parent: [data.entity?.parent, []],
        sourceMappings: [data.entity?.sourceMappings ?? [], []]
      });
      this.parentOptions = data.parentOptions;
    });
  }

  get sourceMappings(): FormArray {
    return this.form.get('sourceMappings') as FormArray;
  }

  addMapping() {
    this.sourceMappings.push(new FormControl('', [Validators.required, ]));
  }
  removeMapping(index: number) {
    this.sourceMappings.removeAt(index);
  }

  submit() {
    if (this.isNew) {

    }
  }

  delete() { }

}
