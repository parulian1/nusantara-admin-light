import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IChoiceFieldChoice } from '@nusantara/core';
import { IProductAttribute, IProductClass } from '@nusantara/models';
import { ProductClassService, ProductAttributeService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { PagedResponse } from '@nusantara/core/pagination';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'nus-product-class-detail',
  template: `
    <nus-detail-title
      [originalName]="entityName"
      typeName="Product Class">
    </nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" formControlName="name">
      </label>

      <label>Type
        <select formControlName="type">
            <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
              {{opt.displayName}}
            </option>
        </select>
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}">
        <input type="checkbox" formControlName="requiresShipping">
        Requires Shipping?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}">
        <input type="checkbox" formControlName="trackStock">
        Track Stock?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}">
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let attrFormGroup of attributeForms; let i=index">
            <td>
              <input type="text" [formControl]="attrFormGroup.get('name')">
            </td>
            <td>
              <select [formControl]="attrFormGroup.get('type')">
                <option *ngFor="let opt of this.attributeTypeChoices"
                        [ngValue]="opt.value">
                  {{opt.displayName}}
                </option>
              </select>
            </td>
            <td>
              <button type="button">
                <i class="material-icons">delete_outline</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <button type="submit" [disabled]="!form.valid">Save</button>
      </div>
    </form>
  `,
  styles: [
    'button.add-button { background: transparent; border: none; }',
  ]
})
export class ProductClassDetailComponent extends AbstractDetailComponent implements OnInit {

  typeChoices: IChoiceFieldChoice[];
  attributeTypeChoices: IChoiceFieldChoice[];
  productAttributes: IProductAttribute[];

  entityName: string;
  isBusy = false;

  deletedAttributes: IProductAttribute[] = [];

  constructor(public service: ProductClassService,
              private attributeService: ProductAttributeService,
              private fb: FormBuilder,
              private modalService: NgxSmartModalService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }

  get attributeForms(): FormGroup[] {
    return (this.form.controls.attributes as FormArray).controls as FormGroup[];
  }

  // get deletedAttributes(): IProductAttribute[] {
  //   (this.form.get('_deletedAttributes') as FormArray).value()
  // }

  get isDigitalProduct(): boolean {
    return (this.form.get('type') as FormControl)?.value === 'digital';
  }

  ngOnInit(): void {

    this.route.data.subscribe((
      data: {
        entity: IProductClass,
        typeChoices: IChoiceFieldChoice[],
        attributeTypeChoices: IChoiceFieldChoice[],
        productAttributes: PagedResponse<IProductAttribute>}) => {

      this.attributeTypeChoices = data.attributeTypeChoices;
      this.typeChoices = data.typeChoices;
      this.productAttributes = data.productAttributes?.entities ?? [];
      this.productAttributes.unshift(null);

      this.initializeForm(data.entity);

      this.entityName = data.entity?.name;

      this.type.valueChanges.subscribe((value) => this.onTypeChanged(value));
    });
  }

  /**
   * Sets up the initial form state.
   *
   * @param entity
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
      type: [attr?.type, ],
      productClasses: [attr?.productClasses ?? [this.form.get('href').value, ]],
      minValue: [attr?.minValue, ],
      maxValue: [attr?.maxValue, ]
    });

    // if the attr already has an href (it exists in the database)
    // then the name and type may not be changed.
    if (!!attrGroup.get('href').value) {
      attrGroup.get('name').disable();
      attrGroup.get('type').disable();
      attrGroup.get('minValue').disable();
      attrGroup.get('maxValue').disable();
    }

    (this.form.get('attributes') as FormArray).push(attrGroup);
  }

  /**
   * Flags an attribute
   * @param attr
   */
  removeAttribute(attr: IProductAttribute) {
    // todo: remove the attribute from the forms

    if (!attr.href || this.isNew) {
      // doesn't need pushed to api if all the same.
    } else {
      attr.productClasses = attr.productClasses.filter(
        href => href !== this.href.value
      );

    }
  }

  save() {
    this.service
    .save(this.form.getRawValue() as IProductClass)
    .subscribe((result) => {
      if (result.success) {
        // update all the attributes
        for (const attrForm of this.attributeForms) {
          // todo: make sure the href of parent is present!
          const attr = attrForm.value as IProductAttribute;
          if (!attr.productClasses.includes(this.href.value)) {
            attr.productClasses.push(this.href.value);
          }
          this.attributeService.save(attr).subscribe();
        }

        // todo: remove any of the deleted attributes
        for (const attrToRemove of this.deletedAttributes) {
          if (attrToRemove.productClasses.includes(this.href.value)) {
            attrToRemove.productClasses = attrToRemove.productClasses.filter(href => href !== this.href.value);
          }
        }
      }
    });

    // // save all the attributes
    // this.attributeForms.forEach(
    //   (attrForm) => {
    //     obs = obs.pipe(
    //       result => this.attributeService.save(attrForm.value as IProductAttribute)
    //     );
    //   }
    // );
    //
    // obs.subscribe(result => {
    //   this.router.navigate(['.'], {relativeTo: this.route});
    // });

  }

  delete() {

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
