import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';
import { AbstractDetailComponent, IEntityHref } from '@nusantara/core';

@Component({
  selector: 'nus-category-detail',
  template: `
    <nus-detail-title [originalName]="entityName" typeName="Category">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()">
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
          <option *ngFor="let parent of parentOptions" [ngValue]="parent.href">{{parent.pathName}}</option>
        </select>
      </label>
      <label>
        Source Mappings (optional)
        <div *ngFor="let control of sourceMappings.controls; index as i">
          <input [formControl]="sourceMappings.controls[i]">
        </div>
        <button type="button" (click)="addMapping()">Add</button>
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
    }
  `]
})
export class CategoryDetailComponent extends AbstractDetailComponent implements OnInit {

  public entityName: string;

  // tracks the original value of the object (probably not necessary unless using template-driven forms)
  public entity: ICategory;

  public parentOptions: ICategory[] = [];

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

    //   this.entity = {
    //     name: '',
    //     href: null,
    //     icon: null,
    //     children: [],
    //     parent: null,
    //     products: null,
    //     sourceMappings: [],
    //   };

    //   this.route.data
    //     .subscribe((data: { entity: ICategory, parentOptions: IEntityHref[] }) => {
    //       if (data.entity) {
    //         this.entity = data.entity;

    //         this.form.setValue({
    //           name: this.entity.name,
    //           icon: this.entity.icon.href,
    //           parent: null,
    //           sourceMappings: this.entity.sourceMappings
    //         });

    //         this.isNew = false;
    //       }

    //       // make sure that parent options **always** has a null option, too.
    //       this.parentOptions = data.parentOptions;
    //       this.parentOptions.unshift({name: '<none>', href: null});
    //       this.isBusy = false;
    //     });
  }

  addMapping() {
    this.sourceMappings.push(new FormControl());
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
