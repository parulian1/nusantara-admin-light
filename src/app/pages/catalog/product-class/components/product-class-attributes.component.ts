import { Component, Input, OnInit } from '@angular/core';
import { drf, products } from '@nusantara/models';
import { IProductAttribute } from '@nusantara/models/products';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'nus-product-class-attributes',
  template: `
    <div>
      <table>
        <thead>
          <tr>
            <th i18n>Name</th>
            <th i18n>Type</th>
            <th i18n>Searchable</th>
<!--            <th i18n>Filterable</th>-->
            <th></th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngIf="form.value?.length > 0">
            <tr
              *ngFor="let attribute of form.controls; let i = index"
              [formGroup]="attribute"
            >
              <td class="immediate-error-display">
                <input type="text" formControlName="name" maxlength="50" />
              </td>
              <td class="immediate-error-display">
                <select formControlName="type">
                  <option disabled selected [ngValue]="null"> --Select-- </option>
                  <option *ngFor="let opt of choices" [ngValue]="opt.value">
                    {{ opt.displayName }}
                  </option>
                </select>
              </td>
              <td>
                <input type="checkbox" formControlName="isSearchable" />
              </td>
<!--              <td>-->
<!--                <input type="checkbox" formControlName="isFilterable" />-->
<!--              </td>-->
              <td *ngIf="!hideRemoveButton">
                <button
                  (click)="removeAttribute(i)"
                  type="button"
                  class="remove-button"
                >
                  <i class="material-icons">remove_circle_outline</i>
                </button>
              </td>
            </tr>
          </ng-container>
          <tr>
            <td colspan="5">
              <button type="button" (click)="addAttribute()" class="add-button" i18n>
                Add Attribute
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ProductClassAttributesComponent implements OnInit {
  @Input() attributes: IProductAttribute[] = [];
  @Input() choices: drf.IChoice[] = [];
  @Input() form: FormArray;
  @Input() hideRemoveButton:boolean

  attributeTypesHide: string[] = ['markdown', 'image'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initialFormValue();
    this.initialChoices();
  }

  initialChoices(): void {
    if (this.choices.length > 0) {
      // #69558, image and richText (markdown) be hide
      this.choices = this.choices.filter(
          choice => !this.attributeTypesHide.includes(choice.value)
      );
    }
  }

  initialFormValue(): void {
    if (this.attributes) {
      this.attributes.forEach((attribute) => {
        this.addAttribute(attribute);
      });
    }
  }

  removeAttribute(index: number) {
    this.form.removeAt(index);
  }

  addAttribute(attr?: products.IProductAttribute) {
    const attrGroup = this.fb.group({
      name: [attr?.name, [Validators.required, Validators.maxLength(50)]],
      href: [attr?.href],
      type: [attr?.type, [Validators.required]],
      minValue: [attr?.minValue],
      maxValue: [attr?.maxValue],
      isSearchable: [attr?.isSearchable ?? false, []],
      isFilterable: [attr?.isFilterable ?? false, []],
    });

    // need to mark as touched to make custom styling works
    attrGroup.controls.isSearchable.markAsTouched();
    attrGroup.controls.isFilterable.markAsTouched();

    // if the attr already has an href (it exists in the database)
    // then the name and type may not be changed.
    if (!!attrGroup.get('href').value) {
      attrGroup.get('type').disable();
    }

    this.form.push(attrGroup);
  }
}
