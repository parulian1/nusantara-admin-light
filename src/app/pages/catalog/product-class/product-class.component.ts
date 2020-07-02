import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IChoiceFieldChoice, ToastService } from '@nusantara/core';
import { IProductAttribute, IProductClass } from '@nusantara/models';
import { ProductClassService, ProductAttributeService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core/components';

@Component({
  selector: 'nus-product-class',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Product Class">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" formControlName="name">
      </label>

      <label>
        <span>Type</span>
        <select formControlName="type">
            <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
              {{opt.displayName}}
            </option>
        </select>
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}" class="without-field-errors">
        <input type="checkbox" formControlName="requiresShipping">
        Requires Shipping?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}" class="without-field-errors">
        <input type="checkbox" formControlName="trackStock">
        Track Stock?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}" class="without-field-errors">
        <input type="checkbox" formControlName="isPerishable">
        Is Perishable?
      </label>

      <h2>
        Attributes
        <button type="button"
                (click)="addAttribute()"
                class="add-button">
          <i class="material-icons">add_circle</i>
        </button>
      </h2>

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
            <td>
              <input type="text" formControlName="name">
            </td>
            <td>
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
              <button type="button" (click)="removeAttribute(i)">
                <i class="material-icons">delete_outline</i>
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
    'button.add-button { background: transparent; border: none; }',
    'label.without-field-errors { min-height: 0; }',
  ]
})
export class ProductClassComponent extends AbstractDetailComponent<IProductClass> implements OnInit {

  typeChoices: IChoiceFieldChoice[];
  attributeTypeChoices: IChoiceFieldChoice[];

  constructor(public service: ProductClassService,
              private attributeService: ProductAttributeService,
              private fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get attributes(): FormArray { return this.form.get('attributes') as FormArray; }

  get attributeForms(): FormGroup[] {
    return (this.form.controls.attributes as FormArray).controls as FormGroup[];
  }

  get isDigitalProduct(): boolean {
    return (this.form.get('type') as FormControl)?.value === 'digital';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { typeChoices: IChoiceFieldChoice[], attributeTypeChoices: IChoiceFieldChoice[] }) => {
      this.attributeTypeChoices = data.attributeTypeChoices;
      this.typeChoices = data.typeChoices;
      this.type.valueChanges.subscribe((value) => this.onTypeChanged(value));
    });
  }

  /**
   * Sets up the initial form state.
   *
   * @param entity the product class that is being edited (or null)
   */
  initializeForm(entity?: IProductClass) {

    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      type: [entity?.type, [Validators.required]],
      requiresShipping: [entity?.requiresShipping, [Validators.required]],
      trackStock: [entity?.trackStock, [Validators.required]],
      isPerishable: [entity?.isPerishable, [Validators.required]],
      attributes: this.fb.array([]),
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

  addAttribute(attr?: IProductAttribute) {
    const attrGroup = this.fb.group({
      name: [attr?.name, [Validators.required, ]],
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

  /**
   * Flags an attribute for removal.
   * @param attr A product attribute that would be removed
   */
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
    [this.form.get('requiresShipping'), this.form.get('trackStock'), this.form.get('isPerishable')].forEach(
      fc => {
        if (value === 'digital') {
          fc.setValue(false);
          fc.disable();
        } else {
          fc.enable();
        }
      }
    );
  }
}
