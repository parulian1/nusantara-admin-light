import {
  AfterViewInit, Component, EventEmitter, forwardRef,
  Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogResult, ToastLevelEnum, ToastService } from '@nusantara/core';
import { IShopAttribute, ISelectedCategory } from '@nusantara/models';
import { MarketplaceShopService } from '@nusantara/services';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';
import { SubFormComponent } from './sub-form.component';

@Component({
  selector: 'nus-attribute-selection-form',
  template: `
    <nus-spinner [appBusy]="isBusy"></nus-spinner>
    
    <form [formGroup]="form">
      <div class="wrapper">
        <h1 class="heading-1">Choose Attribute (2/3)</h1>
        <p>Choose {{ currentShop }} attributes for your product.</p>

        <div class="form">
          <label>
            <span>{{ currentShop }} Category</span>
            <p>{{ categoryNames }}</p>          
          </label>

          <label class="attributes">
            <span>{{ currentShop }} Attributes</span>
            <div *ngIf="mandatoryAttributes">
              <p>Mandatory</p>
              <div class="checkboxes">
                <div *ngFor="let attr of mandatories.controls; let i = index">  
                  <input type="checkbox" [formControl]="attr" formArrayName="mandatories"/>
                  <span>{{ mandatoryAttributes[i].name }}</span>
                </div>
              </div>
            </div>

            <div *ngIf="optionalAttributes">
              <p>Optionals</p>
              <div class="checkboxes">
                <div *ngFor="let attr of optionals.controls; let i = index">
                  <label [for]="i">
                    <input type="checkbox" [id]="i" [formControl]="attr" formArrayName="optionals"/>
                    <span>{{ optionalAttributes[i].name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </label>
          
        </div>
      </div>

      <button type="button" class="control" (click)="marketplaceAttributes? onNext() : onSubmitNoAttributes()" [disabled]="isBusy">
        Next
      </button>
      <button type="button" class="control secondary ghost" (click)="confirmModal.open()">
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
    'label { margin: 0; padding: 0; min-height: 0; }',
    'label.attributes { margin-top: 19px; }',
    `.checkboxes { 
      width: 40vw;
      margin-top: 8px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-row-gap: 25px;
    }`,
    'button:not(:first-of-type) { margin-left: 5px; }',

  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttributeSelectionFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AttributeSelectionFormComponent),
      multi: true,
    },
  ],
})
export class AttributeSelectionFormComponent
  extends SubFormComponent
  implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(ConfirmModalComponent)
  confirmModal: ConfirmModalComponent;

  @Input() state: any;
  @Input() category: ISelectedCategory;
  @Input() currentShop: string;
  @Output() previous = new EventEmitter<boolean>();
  @Output() next = new EventEmitter<any>();
  @Output() saveNoAttr = new EventEmitter<any>();
  @Output() selectedAttribute = new EventEmitter<IShopAttribute[]>();
 
  shopSlug: string;
  marketplaceAttributes: IShopAttribute[];
  mandatoryAttributes: IShopAttribute[];
  optionalAttributes: IShopAttribute[];
  form: FormGroup;
  categoryId: number;
  categoryNames: string;
  selectedCategory: ISelectedCategory = null;
  isBusy: boolean;

  constructor(
    private service: MarketplaceShopService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    super();
    this.initializeForm();
  }

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
  }

  ngOnChanges(changes: SimpleChanges) {
    const currValue: ISelectedCategory = changes.category.currentValue;
    const prevValue: ISelectedCategory = changes.category.previousValue;
    this.categoryId = currValue?.deepestChildId;

    if (currValue && (JSON.stringify(currValue) !== JSON.stringify(prevValue))) {
      this.isBusy = true;
      this.service
        .fetchAttribute(this.shopSlug, currValue.deepestChildId)
        .subscribe(
          (attributes: IShopAttribute[]) => {
            
            // if attributes from marketplace not empty
            if(attributes) {
              [
                this.mandatoryAttributes, 
                this.optionalAttributes,
              ] = attributes.reduce(
                ([mandatories, optionals], attr) => {
                  return attr.isMandatory
                    ? [[...mandatories, attr], optionals]
                    : [mandatories, [...optionals, attr]];
                },
                [[], []]
              );

              this.clearFormArray(this.mandatories);
              this.clearFormArray(this.optionals);
              this.addCheckboxes();

            } else {
              this.clearFormArray(this.mandatories);
              this.clearFormArray(this.optionals);
            }

            this.marketplaceAttributes = attributes;
            this.categoryNames = currValue.categoryNames.join(
              ' > '
            );
            this.isBusy = false;
          },
          (error) => {
            this.toast.addMessage(
              'Something went wrong',
              'error',
              ToastLevelEnum.error
            );
            this.isBusy = false;
          }
        );
    }
  }

  ngAfterViewInit() {
    this.confirmModal.onClose.subscribe(() => this.onConfirmModalClosed());
  }

  private initializeForm() {
    this.form = this.fb.group({
      mandatories: this.fb.array([]),
      optionals: this.fb.array([]),
    });
  }

  addCheckboxes() {
    this.buildCheckboxes(this.mandatoryAttributes).forEach(
      (attr: FormControl) => {
        attr.markAsTouched();
        attr.disable();
        this.mandatories.push(attr);
      }
    );
    this.buildCheckboxes(this.optionalAttributes).forEach(
      (attr: FormControl) => {
        attr.markAsTouched();
        this.optionals.push(attr);
      }
    );
  }

  buildCheckboxes(attributes: IShopAttribute[]) {
    const arr = attributes.map((attr) => {
      return this.fb.control(attr.isMandatory);
    });
    return arr;
  }

  get mandatories() {
    return this.form.get('mandatories') as FormArray;
  }

  get optionals() {
    return this.form.get('optionals') as FormArray;
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  onPrevious() {
    this.previous.next(true);
  }

  onNext() {
    this.next.next(true);
    const mandatoryvalues = this.mandatories.value.map(
      (_: boolean, i: number) => {
        return this.mandatoryAttributes[i];
      }
    );

    const optionalValues = this.optionals.value
      .map((selected: boolean, i: number) => {
        if (selected) {
          return this.optionalAttributes[i];
        } else {
          return null;
        }
      })
      .filter((attr) => attr !== null);
    this.selectedAttribute.next(mandatoryvalues.concat(optionalValues));
  }

  onSubmitNoAttributes() {
    const formValue = {
      category_id: this.categoryId,
      attributes: [],
    };
    this.saveNoAttr.next(formValue);
  }

  onConfirmModalClosed() {
    if (this.confirmModal.result === DialogResult.OK) {
      this.previous.next(true);
    }
  }
}
