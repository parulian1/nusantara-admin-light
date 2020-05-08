import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory, CategoryService } from './category.service';
import { IEntityHref } from '@nusantara/core';

@Component({
  selector: 'nus-category-detail',
  template: `
    <h1 *ngIf="isNew; then titleForNew else titleForUpdate"></h1>
    <ng-template #titleForUpdate>Update {{ entity.name }}</ng-template>
    <ng-template #titleForNew>New Category</ng-template>

    <form [formGroup]="form" (ngSubmit)="trySubmit()">
      <label>Name
        <input type="text" formControlName="name" required>
      </label>
      <label>
        Icon
        <input type="image" formControlName="icon" required>
      </label>
      <label>
        Parent
        <select formControlName="parent">
          <option *ngFor="let parent of parentOptions" [ngValue]="parent.href">{{parent.name}}</option>
        </select>
      </label>
      <label>
        Source Mappings (optional)
        <div *ngFor="let control of sourceMappings.controls; index as i">
          <input [formControl]="sourceMappings.controls[i]">
        </div>
        <button type="button" (click)="addMapping()">Add</button>
      </label>
      <div>
        <button type="submit">Save</button>
      </div>
    </form>`,
  styles: [``]
})
export class CategoryDetailComponent implements OnInit {

  // tracks the original value of the object (probably not necessary unless using template-driven forms)
  public entity: ICategory;
  public isBusy = false;
  public isNew = true;

  public parentOptions: IEntityHref[] = [];

  public name = new FormControl();
  public icon = new FormControl();
  public parent = new FormControl();
  public sourceMappings = new FormArray([]);

  public form = new FormGroup({
    name: this.name,
    icon: this.icon,
    parent: this.parent,
    sourceMappings: this.sourceMappings
  });

  constructor(private service: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) { }

  addMapping() {
    this.sourceMappings.push(new FormControl());
  }
  removeMapping(index: number) {
    this.sourceMappings.removeAt(index);
  }

  ngOnInit(): void {

    this.entity = {
      name: '',
      href: null,
      icon: null,
      children: [],
      parent: null,
      products: null,
      sourceMappings: [],
    };

    this.route.data
      .subscribe((data: { entity: ICategory, parentOptions: IEntityHref[] }) => {
        if (data.entity) {
          this.entity = data.entity;

          this.form.setValue({
            name: this.entity.name,
            icon: this.entity.icon.href,
            parent: null,
            sourceMappings: this.entity.sourceMappings
          });

          this.isNew = false;
        }

        // make sure that parent options **always** has a null option, too.
        this.parentOptions = data.parentOptions;
        this.parentOptions.unshift({name: '<none>', href: null});
        this.isBusy = false;
      });
  }

  trySubmit() {
    if (this.isNew) {

    }
  }
}
