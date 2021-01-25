import {Component, OnInit, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MarketplaceClientService } from '@nusantara/services';
import {IShopeeAuthResponse} from "@nusantara/models";

@Component({
  selector: 'nus-variant-client-form',
  template: `
    <form [formGroup]="form">
      <div class="variant-container" formArrayName="variantFormArray">
        <div class="variant-class">
          <h1 class="heading-1">Variant Configuration</h1>
            <p>Once you choose, you can't change back.</p>
            <div class="variant" *ngFor="let order of variantFormArray.controls; let i = index" [formGroupName]="i">
              <input type="radio" (change)="onChangeVariant(i)" formControlName="variant" name="variant"  [checked]="i === variantChecked" >
              {{variantType[i].name}}
            </div>
        </div>
        <div class="variant-description">
          <p *ngIf="showDescriptionMerge">
            <br>
            Merge will set the items into parent and variant as child <br><br>
            Example:<br>
            Bhisma product A with 2 variant (red color and blue color)<br>
            MP product A will be 1 parent (red color) and 1 child inside the parent (blue color)<br>
          </p>
          <p *ngIf="showDescriptionSplit">
            <br>
            Split will set all item into parent only or item with no variant/child <br><br>

            Example:<br>
            Bhisma product A with 2 variant (red color and blue color)<br>
            MP product A will be 1 parent (red color) and 1 more parent (blue color)<br>
          </p>
        </div>
      </div>
    </form>
  `,
  styles: [
    '.variant{float: left; margin-right: 15px}',
    '.variant-container{padding-bottom: 30px}',
    '.marketplace{font-size: 20px}',
    '.variant-class{overflow: hidden; vertical-align: bottom}',
    '.variant-description{background-color: #F4F4F4; width: 570px;height: 150px;}',
    'input[type="radio"]{border-radius: 10px;color: orange;}'
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
