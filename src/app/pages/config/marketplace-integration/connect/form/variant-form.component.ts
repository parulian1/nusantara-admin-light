import {Component, OnInit, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MarketplaceClientService } from '@nusantara/services';
import {IShopeeAuthResponse} from '@nusantara/models';

@Component({
  selector: 'nus-variant-client-form',
  template: `
    <form [formGroup]="form" class="fluid">
      <div formArrayName="variantFormArray">
        <div>
          <h1 class="heading-1">Variant Configuration</h1>
            <p>Once you choose, you can't change back.</p>
            <div class="variant-option">
              <span *ngFor="let order of variantFormArray.controls;
                let i = index" [formGroupName]="i">
                  <input type="radio"
                    (change)="onChangeVariant(i)"
                    formControlName="variant"
                    name="variant"
                    [checked]="i === variantChecked"/>
                  <span>{{variantType[i].name}}</span>
              </span>
            </div>
        </div>
        <div class="description">
          <div *ngIf="showDescriptionMerge">
            <div>Merge will set the items into parent and variant as child</div>
            <div class="example">Example:</div>
            <div>Bhisma product A with 2 variant (red color and blue color)</div>
            <div>MP product A will be 1 parent (red color) and 1 child inside the parent (blue color)</div>
          </div>
          <div *ngIf="showDescriptionSplit">
            <div>Split will set all item into parent only or item with no variant/child</div>
            <div>Example:</div>
            <div>Bhisma product A with 2 variant (red color and blue color)</div>
            <div>MP product A will be 1 parent (red color) and 1 more parent (blue color)</div>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [
    '.variant-option { margin: 10px 0; }',
    '.variant-option > span { margin-right: 20px }',
    'input[type="radio"]{ margin-right: 8px; }',
    '.description{ padding: 16px 24px; margin: 20px 0; background: var(--darken-white); }',
    '.example { margin-top: 10px; font-weight: 700; }'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VariantFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VariantFormComponent),
      multi: true,
    },
  ],
})
export class VariantFormComponent implements OnInit {
  @Input() shopSlug?: string;
  @Input() isEdit: boolean;
  @Input() splitVar:boolean;
  @Output() isSplit = new EventEmitter();

  form: FormGroup;
  showDescriptionMerge: boolean;
  showDescriptionSplit: boolean;
  variantChecked: number;

  constructor(
    private service: MarketplaceClientService,
    private fb: FormBuilder,
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.showDescriptionMerge=true;
    this.showDescriptionSplit= false;
    this.isSplit.emit(false);
    this.variantChecked = 0;
    if(this.isEdit){
      this.service
        .getConnection(this.shopSlug)
        .subscribe((data: IShopeeAuthResponse) => {
          if (data != null) {
            if(data.splitVariant == true){
              this.variantChecked = 1;
            }
          }
        });
    }
  }

  variantType = [
    { id: 1, name: 'Merge Variant' },
    { id: 2, name: 'Split Variant' },
  ];


  get variantFormArray() {
    return this.form.controls.variant as FormArray;
  }

  private initializeForm() {
    this.form = this.fb.group({
      variant: this.fb.array([]),
    });
    this.addRadioButton();
  }

   private addRadioButton() {
    this.variantType.forEach(() => this.variantFormArray.push(new FormControl(false)));
  }

  onChangeVariant(index: number) {
    if(index==0){
      this.showDescriptionMerge = true;
      this.showDescriptionSplit = false;
      this.isSplit.emit(false);
    } else {
      this.showDescriptionSplit = true;
      this.showDescriptionMerge = false;
      this.isSplit.emit(true);
    }
  }
}
