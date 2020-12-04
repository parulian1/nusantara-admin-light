import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { drf, products } from '@nusantara/models';
import { ProductClassService, ProductAttributeService } from '@nusantara/services';

@Component({
  selector: 'nus-product-class',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Product Class">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select [formControl]="type" name="type">
            <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
              {{opt.displayName}}
            </option>
        </select>
      </label>

      <label [ngClass]="{'hidden': isDigitalProduct}" class="without-field-errors">
        <input type="checkbox" [formControl]="requiresShipping" name="requiresShipping">
        Requires Shipping?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}" class="without-field-errors">
        <input type="checkbox" [formControl]="trackStock" name="trackStock">
        Track Stock?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}" class="without-field-errors">
        <input type="checkbox" [formControl]="isPerishable" name="isPerishable">
        Is Perishable?
      </label>

      <h2>Attributes</h2>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Searchable</th>
          <th>Filterable</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let attrFormGroup of attributeForms; let i=index" [formGroup]="attrFormGroup">
          <td class="immediate-error-display">
            <input type="text" formControlName="name" maxlength="50">
          </td>
          <td class="immediate-error-display">
            <select formControlName="type">
              <option *ngFor="let opt of this.attributeTypeChoices"
                      [ngValue]="opt.value">
                {{opt.displayName}}
              </option>
            </select>
          </td>
          <td>
            <input type="checkbox" formControlName="isSearchable">
          </td>
          <td>
            <input type="checkbox" formControlName="isFilterable">
          </td>
          <td>
            <button (click)="removeAttribute(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <button type="button" (click)="addAttribute()" class="add-button">
              Add Attribute
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <br/>
      <table>
        <tr>
          <td class="immediate-error-display">
            <h2>Product Options</h2>
          </td>
          <td class="immediate-error-display">
            <select [formControl]="option" name="option">
              <option [ngValue]=""></option>
              <option *ngFor="let optionChoice of optionChoices"
                      [ngValue]="optionChoice.href">
                {{ optionChoice.name }}
              </option>
            </select>
          </td>
        </tr>
      </table>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [ ]
})
export class ProductClassComponent extends AbstractDetailComponent<products.IProductClass> implements OnInit {

  typeChoices: drf.IChoice[];
  attributeTypeChoices: drf.IChoice[];
  optionChoices: Array<products.IProductOption>;

  constructor(service: ProductClassService,
              private attributeService: ProductAttributeService,
              private fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get requiresShipping(): FormControl { return this.form.get('requiresShipping') as FormControl; }
  get trackStock(): FormControl { return this.form.get('trackStock') as FormControl; }
  get isPerishable(): FormControl { return this.form.get('isPerishable') as FormControl; }
  get attributes(): FormArray { return this.form.get('attributes') as FormArray; }
  get option(): FormControl { return this.form.get('option').get('href') as FormControl; }

  get attributeForms(): FormGroup[] {
    return (this.form.controls.attributes as FormArray).controls as FormGroup[];
  }

  get isDigitalProduct(): boolean {
    return (this.form.get('type') as FormControl)?.value === 'digital';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { typeChoices: drf.IChoice[],
                                            attributeTypeChoices: drf.IChoice[],
                                            optionChoices: products.IProductOption[]}) => {
      this.attributeTypeChoices = data.attributeTypeChoices;
      this.typeChoices = data.typeChoices;
      this.type.valueChanges.subscribe((value) => this.onTypeChanged(value));
      this.optionChoices = data.optionChoices;
    });
  }

  initializeForm(entity?: products.IProductClass) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      href: [entity?.href],
      type: [entity?.type, [Validators.required]],
      requiresShipping: [entity?.requiresShipping ?? true],
      trackStock: [entity?.trackStock ?? true],
      isPerishable: [entity?.isPerishable ?? false],
      attributes: this.fb.array([]),
      option: this.fb.group({href: [entity?.option?.href, []]}),
    });

    // attributes are added separately from the primary loop because they're require substational authentication logic
    for (const attr of entity?.attributes ?? []) {
      this.addAttribute(attr);
    }

    // users cannot change 'type' of product class once it has been created.
    if (!this.isNew) {
      this.type.disable();
    }
  }

  addAttribute(attr?: products.IProductAttribute) {
    const attrGroup = this.fb.group({
      name: [attr?.name, [Validators.required, Validators.maxLength(50)]],
      href: [attr?.href, ],
      type: [attr?.type, [Validators.required, ]],
      minValue: [attr?.minValue, ],
      maxValue: [attr?.maxValue, ],
      isSearchable: [attr?.isSearchable ?? false, []],
      isFilterable: [attr?.isFilterable ?? false, []],
    });

    // if the attr already has an href (it exists in the database)
    // then the name and type may not be changed.
    if (!!attrGroup.get('href').value) {
      attrGroup.get('type').disable();
    }

    this.attributes.push(attrGroup);
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  getFormValue(): any {
    // overridden: in this case, we want to include the value of disabled components.
    return this.form.getRawValue();
  }

  /**
   * Event handler for whenever the user has changed the type of the product.
   *
   * For digital products, disable attributes only relevant for physical
   * products, otherwise, ensure they're enabled.
   */
  private onTypeChanged(value: string) {
    const typeDependantControls = [this.requiresShipping, this.trackStock, this.isPerishable, ];
    typeDependantControls.forEach(fc => {
      if (value === 'digital') {
        fc.setValue(false);
    }});
  }
}
