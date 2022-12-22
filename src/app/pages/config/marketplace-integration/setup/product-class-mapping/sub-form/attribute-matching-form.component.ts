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
import { marketplace } from '@nusantara/models';
import { MarketplaceProductClassService } from '@nusantara/services';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';
import { SubFormComponent } from './sub-form.component';

@Component({
  selector: 'nus-attribute-matching-form',
  template: `
    <form [formGroup]="form">
      <div class="wrapper">
        <h1 class="heading-1" i18n>Match Attribute (3/3)</h1>
        <p i18n>Choose {{ currentShop }} attributes for your product.</p>

        <div class="form">
          <label>
            <span i18n>{{ currentShop }} Category </span>
            <p>{{ categoryNames }}</p>
          </label>

          <label>
            <span i18n>{{ currentShop }} Attributes </span>
            <p>{{ attributeNames }}</p>
          </label>

          <h4 class="subheading-2" i18n>Match {{ currentShop }} Attribute</h4>
          <div>
            <div class="attribute-group">
              <p i18n>{{ currentShop }} Attributes</p>
              <p i18n>Type {{ currentShop }}</p>
              <p i18n>Bhisma Attributes</p>
              <p i18n>Type Bhisma</p>
            </div>
            <div formArrayName="attributes" class="attributes">
              <div *ngFor="let attr of attributes.controls; let i = index" [formGroupName]="i">
                <input type="text" formControlName="marketplaceName" readonly />
                <input type="text" formControlName="marketplaceType"
                  [ngClass]="attributes.controls[i].get('bhismaType').invalid? 'mismatch': null" readonly/>
                <div>
                  <select #selectedAttr
                    formControlName="bhismaObj"
                    (change)="attrChange(selectedAttr.value, i)"
                    [ngClass]="{ 'mismatch warning': attributes.controls[i].get('bhismaObj').invalid}">

                    <option [ngValue]="null" i18n>Select an option</option>
                    <option *ngFor="let opt of bhismaAttributes" [ngValue]="opt">
                      {{ opt.name }}
                    </option>
                    <option value="addNewAttr" i18n>
                      + Add New Attribute
                    </option>
                  </select>
                  <div *ngIf="attributes.controls[i].get('bhismaObj').invalid"class="error-detail" i18n>
                    Please select an option
                  </div>
                  <div *ngIf="selectedAttr.value === 'addNewAttr'" class="new-attr-input">
                    <input type="text" formControlName="newAttrName" />
                    <div *ngIf="
                        attributes.controls[i].get('newAttrName').hasError('required') &&
                        attributes.controls[i].get('newAttrName').touched
                      " class="error-detail" i18n>
                      This field is required
                    </div>
                    <div *ngIf="
                        attributes.controls[i].get('newAttrName').hasError('maxlength')" class="error-detail" i18n>
                      Max length 100
                    </div>
                  </div>
                </div>
                <div>
                  <select formControlName="bhismaType"
                    [ngClass]="attributes.controls[i].get('bhismaType').valid? 'match': 'mismatch warning'">

                    <option [ngValue]="null" i18n>Select an option</option>
                    <option *ngFor="let type of bhismaAttributeTypes">{{ type }}</option>
                  </select>
                  <div *ngIf="attributes.controls[i].get('bhismaType').invalid" class="error-detail" i18n>
                    Match with {{ currentShop }} Type
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="control" (click)="onSubmit()" [disabled]="form.invalid" i18n>
        Submit
      </button>
      <button type="button" class="control secondary ghost" (click)="confirmModal.open()" i18n>
        Previous
      </button>
    </form>

    <!-- Modals -->
    <nus-confirm-modal></nus-confirm-modal>
  `,
  styles: [
    `.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; width: 60vw; margin-bottom: 20px; }`,
    'p {color: var(--darken-grey); }',
    '.form { margin-top: 20px; }',
    'label { margin-bottom: 12px; min-height: 0; }',
    'button:not(:first-of-type) { margin-left: 5px; }',
    '.attribute-group{ display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 10px; margin-bottom: 4px; }',
    `.attributes > div {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;
        margin-bottom: 8px;
    }`,
    '.new-attr-input { margin-top: 4px; }',
    '.add-new-attr { font-weight: 600; font-size: 16px; }',
    '.error-detail { text-align: left; }',
    '.match { border-color: var(--success) !important; }',
    '.mismatch { border-color: var(--error) !important; }',
    `.warning { background: url('~src/assets/warning-24px.svg') no-repeat scroll right 15px center !important;}`
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
  @Input() category: marketplace.ISelectedCategory;
  @Input() attribute: marketplace.IShopAttribute[];
  @Input() currentShop: string;
  @Output() previous = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  @Output() patchAttr = new EventEmitter<any>();

  shopSlug: string;
  productClassSlug: string;
  form: FormGroup;
  categoryId: number;
  categoryCode:string;
  categoryNames: string;
  attributeNames: string;
  selectedCategory: marketplace.ISelectedCategory = null;
  bhismaAttributes: marketplace.IShopAttribute[];
  bhismaAttributeTypes: string[];
  marketplaceAttributes: marketplace.IShopAttribute[];
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
        const marketplaceType = control.get('marketplaceType');
        const bhismaType = control.get('bhismaType');
        bhismaType.setValidators(this.isMatch(marketplaceType.value));
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    const attrCurrValue = changes.attribute?.currentValue;

    if (
      JSON.stringify(attrCurrValue) !== JSON.stringify(this.marketplaceAttributes)
    ) {
      if (this.productClassSlug) {
        this.service
          .fetchAttribute(this.productClassSlug)
          .subscribe((data: marketplace.IShopAttributeMapping) => {
            this.bhismaAttributes = data.attributes;
            this.bhismaAttributeTypes = data.attributeType;
          });
        if (this.category) {
          this.categoryId = this.category.deepestChildId;
          this.categoryCode = this.category.deepestChildCode ? this.category.deepestChildCode : null;
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
    this.marketplaceAttributes = attrCurrValue;
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

  addAttributeInputs(attrs: marketplace.IShopAttribute[]) {
    if (attrs) {
      attrs.forEach((obj) => {
        if (!obj.isSpecialAttribute){
          obj.isSpecialAttribute = false
        }

        const attrGroup = this.fb.group({
          marketplaceName: obj.name,
          marketplaceType: obj.type,
          bhismaObj: ['', Validators.required],
          bhismaType: ['', Validators.required],
          newAttrName: null,
          isVariant:obj.isVariant,
          isSpecialAttribute:obj.isSpecialAttribute
        });
        this.attributes.push(attrGroup);
      });
    }
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
      category_code: this.categoryCode,
      attributes: this.formValueMapping,
    };

    // form value for marketplace api
    this.save.next(formValue);

    if (this.newAttrFiltered.length !== 0) {
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
      attr.setValidators(Validators.compose([Validators.required, Validators.maxLength(100)]));
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
        marketplace_attribute_name: attr.marketplaceName,
        marketplace_attribute_id: this.marketplaceAttributes[i].attributeId,
        marketplace_attribute_code: this.marketplaceAttributes[i].attributeCode,
        marketplace_attribute_type: attr.marketplaceType,
        marketplace_attribute_option: this.marketplaceAttributes[i].options,
        product_class_attribute_id: attr.bhismaObj.attributeId
          ? attr.bhismaObj.attributeId
          : null,
        product_class_attribute_type: attr.bhismaType,
        new_attribute_name: attr.newAttrName,
        isVariant:attr.isVariant,
        isSpecialAttribute: attr.isSpecialAttribute
      };
    });
  }
}
