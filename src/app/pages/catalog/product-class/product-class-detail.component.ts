import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IChoiceFieldChoice } from '@nusantara/core';
import { IProductAttribute, IProductClass } from '@nusantara/models';
import { ProductClassService, ProductAttributeService } from '@nusantara/services';
import { AbstractDetailComponent } from '@nusantara/core/components';

/**
 * Update or create a new Product Class.
 */
@Component({
  selector: 'nus-product-class-detail',
  template: `
    <nus-detail-title [originalName]="entityName" typeName="Product Class"></nus-detail-title>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <h2>Basic</h2>
      <label>Name <input type="text" formControlName="name"></label>
      <label>Type
        <select formControlName="type">
            <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
              {{opt.displayName}}
            </option>
        </select>
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}">
        <input type="checkbox"
               formControlName="requiresShipping">
        Requires Shipping?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}">
        <input type="checkbox"
               formControlName="trackStock">
        Track Stock?
      </label>
      <label [ngClass]="{'hidden': isDigitalProduct}">
        <input type="checkbox"
               formControlName="isPerishable">
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
              <input type="text"
                     [formControl]="attrFormGroup.get('name')"
                     placeholder="Name">
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

  public typeChoices: IChoiceFieldChoice[];
  public attributeTypeChoices: IChoiceFieldChoice[];

  public entityName: string;
  public isBusy = false;

  constructor(public service: ProductClassService,
              private attributeService: ProductAttributeService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit(): void {

    this.route.data.subscribe((data: { entity: IProductClass,
                                       typeChoices: IChoiceFieldChoice[],
                                       attributeTypeChoices: IChoiceFieldChoice[] }) => {

      this.form = this.fb.group({
        name: [data.entity?.name, [Validators.required]],
        href: [data.entity?.href],
        type: [data.entity?.type, [Validators.required]],
        requiresShipping: [data.entity?.requiresShipping, [Validators.required]],
        trackStock: [data.entity?.trackStock, [Validators.required]],
        isPerishable: [data.entity?.isPerishable, [Validators.required]],
        attributes: this.fb.array([]),
        _deletedAttributes: this.fb.array([])
      });

      this.entityName = data.entity?.name;

      for (const attr of data.entity?.attributes ?? []) {
        this.addAttribute(attr);
      }

      // data.entity?.attributes.forEach(
      //   attr => this.addAttribute(attr)
      // );

      this.attributeTypeChoices = data.attributeTypeChoices;
      this.typeChoices = data.typeChoices;

      this.form.get('type').valueChanges.subscribe((value) => this.onTypeChanged(value));
    });
  }

  get attributeForms(): FormGroup[] {
    return (this.form.controls.attributes as FormArray).controls as FormGroup[];
  }

  // get deletedAttributes(): IProductAttribute[] {
  //   (this.form.get('_deletedAttributes') as FormArray).value()
  // }

  get isDigitalProduct(): boolean {
    return (this.form.get('type') as FormControl).value === 'digital';
  }

  addAttribute(attr?: IProductAttribute) {
    const attrGroup = this.fb.group({
      name: [attr?.name, [Validators.required, ]],
      href: [attr?.href, ],
      type: [attr?.type, ],
      productClass: [attr?.productClass ?? this.form.get('href').value],
      choices: this.fb.array(
        attr?.choices.map(v => new FormControl(v)) ?? []
      ),
      minValue: [attr?.minValue, ],
      maxValue: [attr?.maxValue, ]
    });
    (this.form.get('attributes') as FormArray).push(attrGroup);
  }

  removeAttribute(attr: IProductAttribute) {
    // moves it to the 'removed' attributes group.
  }

  /**
   * Tries to save the form data to the API.
   */
  submit() {
    this.isBusy = true;
    let obs = this.service.save(this.form.value as IProductClass);

    // save all the attributes
    this.attributeForms.forEach(
      (attrForm) => {
        obs = obs.pipe(
          result => this.attributeService.save(attrForm.value as IProductAttribute)
        );
      }
    );

    obs.subscribe(result => {
      console.log('Success?', result.success);
      this.isBusy = false;
      this.router.navigate(['.'], {relativeTo: this.route});
    });

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
