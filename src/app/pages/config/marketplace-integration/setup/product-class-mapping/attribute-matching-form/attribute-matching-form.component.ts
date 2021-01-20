import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogResult } from '@nusantara/core';
import {
  IShopAttribute,
  ISelectedCategory,
  IShopAttributeMapping,
} from '@nusantara/models';
import { MarketplaceProductClassService } from '@nusantara/services';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';
import { SubFormComponent } from '../sub-form.component';

@Component({
  selector: 'nus-attribute-matching-form',
  template: `
    <h2 class="sub-title">Match Attribute (3/3)</h2>
    <p>Choose {{currentShop}} attributes for your product.</p>
    <form [formGroup]="form">
      <p class="form-title">{{currentShop}} Category</p>
      <p>{{ categoryNames }}</p>

      <p class="form-title">{{currentShop}} Attributes</p>
      <p>{{ attributeNames }}</p>
      <h2>Attributes</h2>
      <table>
        <thead>
          <tr>
            <th colspan="2">{{currentShop}} Attributes</th>
            <th colspan="2">Bhisma Attributes</th>
          </tr>
        </thead>
        <tbody>
          <ng-container formArrayName="attributes">
            <tr
              *ngFor="let attr of attributes.controls; let i = index"
              [formGroupName]="i"
            >
              <td>
                <input type="text" formControlName="shopeeName" readonly />
              </td>
              <td>
                <input
                  type="text"
                  formControlName="shopeeType"
                  [ngClass]="
                    attributes.controls[i].get('bhismaType').invalid
                      ? 'error-display'
                      : null
                  "
                  readonly
                />
              </td>

              <td>
                <select
                  #selectedAttr
                  formControlName="bhismaObj"
                  (change)="attrChange(selectedAttr.value, i)"
                  [ngClass]="{
                    'error-display error-warning': attributes.controls[i].get(
                      'bhismaObj'
                    ).invalid
                  }"
                >
                  <option [ngValue]="null">Select an option</option>
                  <option *ngFor="let opt of bhismaAttributes" [ngValue]="opt">
                    {{ opt.name }}
                  </option>
                  <option class="add-new-attr" value="addNewAttr">
                    + Add New Attribute
                  </option>
                </select>
                <div
                  *ngIf="attributes.controls[i].get('bhismaObj').invalid"
                  class="error-detail"
                >
                  Please select an option
                </div>
                <div *ngIf="selectedAttr.value === 'addNewAttr'">
                  <input type="text" formControlName="newAttrName" />
                  <div
                    *ngIf="
                      attributes.controls[i].get('newAttrName').invalid &&
                      attributes.controls[i].get('newAttrName').touched
                    "
                    class="error-detail"
                  >
                    This field is required
                  </div>
                </div>
              </td>

              <td>
                <select
                  formControlName="bhismaType"
                  [ngClass]="
                    attributes.controls[i].get('bhismaType').valid
                      ? 'correct-display'
                      : 'error-display error-warning'
                  "
                >
                  <option [ngValue]="null">Select an option</option>
                  <option *ngFor="let type of bhismaAttributeTypes">
                    {{ type }}
                  </option>
                </select>
                <div
                  *ngIf="attributes.controls[i].get('bhismaType').invalid"
                  class="error-detail"
                >
                  Match with {{currentShop}} Type
                </div>
              </td>
            </tr>
          </ng-container>
        </tbody>
      </table>

      <br />
      <button
        type="button"
        class="control secondary"
        (click)="confirmModal.open()"
      >
        Previous
      </button>
      <button
        type="button"
        class="control"
        (click)="onSubmit()"
        [disabled]="form.invalid"
      >
        Submit
      </button>
    </form>

    <!-- Modals -->
    <nus-confirm-modal></nus-confirm-modal>
  `,
  styles: [
    `
      button:not(:first-child) {
        margin-left: 5px;
      }
      th:not(:first-child) {
        text-align: left;
      }

      .sub-title,
      .add-new-attr {
        color: #365dc3;
      }
      .add-new-attr {
        font-weight: 600;
        font-size: 16px;
      }

      h1 {
        font-weight: bold;
      }

      .form-title {
        font-weight: 700;
        color: #5a5a5a;
      }

      input[type='text'],
      select {
        width: 15vw;
      }

      .error-detail {
        text-align: left;
      }

      .correct-display {
        border-color: var(--success) !important;
      }
      .error-display {
        border-color: var(--error) !important;
      }
      .error-warning {
        background: url('assets/warning-24px.svg') no-repeat scroll right 15px
          center !important;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttributeMatchingFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AttributeMatchingFormComponent),
      multi: true,
    },
  ],
})
export class AttributeMatchingFormComponent
  extends SubFormComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  @ViewChild(ConfirmModalComponent)
  confirmModal: ConfirmModalComponent;

  @Input() state: any;
  @Input() category: ISelectedCategory;
  @Input() attribute: IShopAttribute[];
  @Input() currentShop: string;
  @Output() previous = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  @Output() patchAttr = new EventEmitter<any>();

  shopSlug: string;
  productClassSlug: string;
  form: FormGroup;
  categoryId: number;
  categoryNames: string;
  attributeNames: string;
  selectedCategory: ISelectedCategory = null;
  bhismaAttributes: IShopAttribute[];
  bhismaAttributeTypes: string[];
  shopeeAttributes: IShopAttribute[];
  productClassAttrId: number;
  isShowSelectBhismaAttr: boolean;
  isShowSInputBhismaAttr: boolean;

  constructor(
    private service: MarketplaceProductClassService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.initializeForm();
  }

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
    this.productClassSlug = this.state.productClass?.slug;
    this.form.valueChanges.subscribe((changes) => {
      this.attributes.controls.forEach((control) => {
        const shopeeType = control.get('shopeeType');
        const bhismaType = control.get('bhismaType');
        bhismaType.setValidators(this.isMatch(shopeeType.value));
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const catCurrValue = changes.category?.currentValue;
    const attrCurrValue = changes.attribute?.currentValue;

    if (
      JSON.stringify(attrCurrValue) !== JSON.stringify(this.shopeeAttributes)
    ) {
      if (this.productClassSlug) {
        this.service
          .fetchAttribute(this.productClassSlug)
          .subscribe((data: IShopAttributeMapping) => {
            this.bhismaAttributes = data.attributes;
            this.bhismaAttributeTypes = data.attributeType;
          });

        if (catCurrValue) {
          this.categoryId = this.category.deepestChildId;
          this.categoryNames = this.category.categoryNames.join(' > ');
        }
        if (attrCurrValue) {
          this.attributeNames = this.attribute
            .map((attr) => {
              return attr.name;
            })
            .join(' | ');
        }

        // reset form
        this.clearFormArray(this.attributes);
        this.addAttributeInputs(attrCurrValue);
      }
    }
    this.shopeeAttributes = attrCurrValue;
  }

  ngAfterViewInit() {
    this.confirmModal.onClose.subscribe(() => this.onConfirmModalClosed());
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  private initializeForm() {
    this.form = this.fb.group({
      attributes: this.fb.array([]),
    });
  }

  get attributes() {
    return this.form.get('attributes') as FormArray;
  }

  addAttributeInputs(attrs: IShopAttribute[]) {
    attrs.forEach((obj) => {
      const attrGroup = this.fb.group({
        shopeeName: obj.name,
        shopeeType: obj.type,
        bhismaObj: ['', Validators.required],
        bhismaType: ['', Validators.required],
        newAttrName: null,
      });
      this.attributes.push(attrGroup);
    });
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  isMatch(type: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return control.value
        ? control.value === type
          ? null
          : { match: false }
        : { match: false };
    };
  }

  onConfirmModalClosed() {
    if (this.confirmModal.result === DialogResult.OK) {
      this.previous.next(true);
    }
  }

  onSubmit() {
    const formValue = {
      category_id: this.categoryId,
      attributes: this.formValueMapping,
    };

    // form value for marketplace api
    this.save.next(formValue);

    if (this.newAttrFiltered.length != 0) {
      const newAttrValue = {
        attributes: this.newAttrFiltered,
      };
      // form value for patch to catalog api
      this.patchAttr.next(newAttrValue);
    }
  }

  attrChange(value: string, index: number) {
    const attr = this.attributes.at(index).get('newAttrName');
    if (value === 'addNewAttr') {
      attr.setValidators(Validators.required);
    } else {
      attr.clearValidators();
      attr.reset();
    }
    attr.updateValueAndValidity();
  }

  get newAttrFiltered() {
    // filter for new attribute, take only not null value
    return this.newAttr.filter((item) => item.name !== null);
  }

  get newAttr() {
    // only for new attribute
    return this.attributes.value.map((attr: any) => {
      return {
        type: attr.bhismaType,
        name: attr.newAttrName,
      };
    });
  }

  get formValueMapping() {
    return this.attributes.value.map((attr: any, i: number) => {
      // check if attribute ID null then productclassAttrId should be null
      this.productClassAttrId = attr.bhismaObj.attributeId;
      if (!attr.bhismaObj.attributeId) {
        this.productClassAttrId = null;
      }

      return {
        marketplace_attribute_name: attr.shopeeName,
        marketplace_attribute_id: this.shopeeAttributes[i].attributeId,
        marketplace_attribute_type: attr.shopeeType,
        marketplace_attribute_option: this.shopeeAttributes[i].options,
        product_class_attribute_id: attr.bhismaObj.attributeId
          ? attr.bhismaObj.attributeId
          : null,
        product_class_attribute_type: attr.bhismaType,
        new_attribute_name: attr.newAttrName,
      };
    });
  }
}
