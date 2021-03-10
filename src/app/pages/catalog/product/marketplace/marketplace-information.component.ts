import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceStockInfoModalComponent, MarketplaceShippingInfoModalComponent, SlideInOutAnimation } from '@nusantara/shared';
import { IClient, IMarketplaceItemAttributeInformation, IMarketplaceItemInformation, IMarketplaceItemLogisticInformation, products} from '@nusantara/models';
import { MarketplaceClientService, MarketplaceItemService } from '@nusantara/services';
import { AbstractEditingComponent } from '@nusantara/core';

@Component({
  selector: 'nus-marketplace-info',
  animations: [SlideInOutAnimation],
  template: `
    <div class="wrapper">
      <h1 class="heading-1">Marketplace Information</h1>
      <div class="subinfo">
        <div class="subheading-2">Marketplace Publish Summary</div>
        <a (click)="marketplaceStockInfo.open()">More Detail</a>
      </div>
      <div class="summary">
        <div class="wrapper">
          <p class="body-2">Warehouse</p>
          <p class="title-1">{{ warehouseCount }}</p>
        </div>
        <div class="wrapper">
          <p class="body-2">Marketplace</p>
          <p class="title-1">{{ marketplaceCount }}</p>
        </div>
        <div class="wrapper">
          <p class="body-2">Store</p>
          <p class="title-1">{{ storeCount }}</p>
        </div>
      </div>
      <div class="subinfo">
        <div>
          <h4 class="subheading-2">Shipping</h4>
          <p>View shipping method for your marketplace stores.</p>
        </div>
        <a (click)="shippingInfo.open();">More Detail</a>
      </div>
      <div class="detail">
        <h4 class="subheading-2">Marketplace Product Detail</h4>
        <p>This information will be used as specific per marketplace. Skip this if you don't want to publish to marketplace.</p>
      </div>
      <div class="detail-store">
        <nus-tabs (select)="getAttributes($event)" [fluid]="true">
          <nus-tab *ngFor="let client of clientList" [title]="client.marketplaceName">
            <div *ngIf="!productClassChanged">
              <div *ngFor="let data of marketplaceStoreAttributes; let storeIndex = index">
                <div class="store">
                  <div>
                    <p class="body-2">Store</p>
                    <h4 class="subheading-2">{{ data.shop }}</h4>
                  </div>
                  <button type="button" class="expand" (click)="toggleStore(storeIndex)">
                    <i class="material-icons" >{{ showedStore === storeIndex && isStoreExpanded? 'expand_less':'expand_more' }}</i>
                  </button>
                </div>
                <div [@slideInOut]="animationState" *ngIf="showedStore === storeIndex">
                  <div *ngIf="data.attributes.length; else noAttributeMatch" class="attr-table" [formGroup]="form">
                    <h4 class="subheading-2">Attribute</h4>
                    <table>
                      <thead>
                        <th>Name</th>
                        <th>Value</th>
                      </thead>
                      <tbody formArrayName="attributes" *ngIf="attributesFormArray.controls.length">
                        <tr *ngFor=" let attr of attributesFormArray.controls; let i = index" [formGroupName]="i">
                          <td *ngIf="storeIndex === attributesFormArray.controls[i].value.indexShop">
                            {{ attributesFormArray.controls[i].value.name }}
                          </td>
                          <td *ngIf="storeIndex === attributesFormArray.controls[i].value.indexShop">

                            <div *ngIf="attributesFormArray.controls[i].value.type === 'combo box' || attributesFormArray.controls[i].value.type === 'dropdown'">
                              <select #selecteEditAttr formControlName="value"
                                (change)="attrChange(selecteEditAttr.value, i)">
                                <option [ngValue]="null">
                                  Select attribute value of {{
                                  attributesFormArray?.controls[i].value.name }}
                                </option>
                                <option *ngFor="let opt of attributesFormArray?.controls[i].value.option" [ngValue]="opt">
                                  {{ opt }}
                                </option>
                                <option class="add-new-attr" value="addNewAttr" *ngIf="attributesFormArray.controls[i].value.type === 'combo box'">
                                  <i class="material-icons">add</i> Add New Attribute
                                </option>
                              </select>
                              <div *ngIf="selecteEditAttr.value === 'addNewAttr'">
                                <input type="text" formControlName="newValue" />
                                <div *ngIf="attributesFormArray.controls[i].get('newValue').invalid && attributesFormArray.controls[i].get('newValue').touched"class="error-detail">
                                  This field is required
                                </div>
                              </div>
                            </div>
                            <div *ngIf="client.option === LZD && attributesFormArray.controls[i].value.marketplaceAttributeName === 'SellerSku' || attributesFormArray.controls[i].value.marketplaceAttributeName === 'price'; else nonDisable">
                              <input formControlName="value" type="text" readonly *ngIf="attributesFormArray.controls[i].value.marketplaceAttributeName === 'SellerSku'"/>
                              <input formControlName="value" type="number" readonly *ngIf="attributesFormArray.controls[i].value.marketplaceAttributeName === 'price'"/>
                            </div>

                            <ng-template #nonDisable>
                                <input formControlName="value" type="text" *ngIf="attributesFormArray.controls[i].value.type === 'text'"/>
                              <input formControlName="value" type="number" *ngIf="attributesFormArray.controls[i].value.type === 'integer'"/>
                            </ng-template>

                            <input formControlName="value" type="text" *ngIf="attributesFormArray.controls[i].value.type === 'text' && client.option !== LZD"/>
                            <input formControlName="value" type="number" *ngIf="attributesFormArray.controls[i].value.type === 'integer' && client.option !== LZD"/>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <ng-template #noAttributeMatch>
                    <div class="no-attribute">
                      <div *ngIf="client.option === TSC; else nonTscEmptyInfo">
                        <h3 class="subheading-1">Product class doesn't have attribute.</h3>
                      </div>
                      <ng-template #nonTscEmptyInfo>
                        <h1 class="heading-1">Product Class is Not Mapped Yet!</h1>
                        <p>Map Class to sync your product to marketplace.</p>
                        <button [routerLink]="['/config/marketplace-integration/connect/product-class/',
                              data.shopSlug,
                              productClassSlug
                            ]"
                          [state]="{ productClass: { name: productClassName, slug: productClassSlug } }"
                          type="button"
                          class="control">Start Mapping
                        </button>
                      </ng-template>
                    </div>
                  </ng-template>
                </div>
              </div>
            </div>
            <div *ngIf="emptyStore" class="no-attribute">
              <h1 class="heading-1">No Connected Store Yet!</h1>
              <p>Add a marketplace store to manage all your products in one place.</p>
              <button type="button" [routerLink]="['/config/marketplace-integration/connect/new']" class="control">
                <i class="material-icons">add</i>Add Store
              </button>
            </div>
          </nus-tab>
        </nus-tabs>
      </div>
    </div>

    <nus-marketplace-shipping-info-modal [shippingDetail]="shippingDetail"></nus-marketplace-shipping-info-modal>
    <nus-marketplace-stock-info-modal [warehouseInfoDetail]="warehouseInfoDetail"></nus-marketplace-stock-info-modal>
  `,
  styles: [
    '.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; margin-bottom: 24px; }',
    'h1 { margin-bottom: 16px; }',
    'p { color: var(--darken-grey); margin: 0; }',
    '.subinfo { display: flex; justify-content: space-between; }',
    '.summary { display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 16px; }',
    '.summary > div { padding: 12px 16px; margin-bottom: 20px; margin-top: 4px; text-align: center; }',
    '.title-1 { font-weight: bold; margin-bottom: 0; }',
    '.detail { margin-top: 24px; }',
    '.detail-store { border: solid 1px var(--grey); border-radius: 4px; margin-top: 8px; }',
    `.store {
        padding: 10px 12px;
        border-bottom: solid 1px var(--grey);
        display: flex;
        justify-content: space-between;
        justify-items: center;  }
    `,
    '.expand { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; }',
    '.attr-table { padding: 16px 12px; }',
    `.no-attribute {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
        border-bottom: solid 1px var(--grey); }
      `,
    '.no-attribute h1 { margin-bottom: 10px; }',
    '.no-attribute p { color : var(--grey); margin-bottom: 24px; }',
    '.no-attribute button { display: flex; justify-content: center; align-items: center; }',
    '.no-attribute button > i { font-size: 20px; }',
    '.add-new-attr { font-weight: 600; font-size: 16px; }',
  ]
})
export class MarketplaceInfoHostComponent extends AbstractEditingComponent<FormGroup> implements OnInit, OnChanges {

  @Input() form: FormGroup;
  @Input() productClass: products.IProductClass;

  @ViewChild(MarketplaceShippingInfoModalComponent) shippingInfo: MarketplaceShippingInfoModalComponent;
  @ViewChild(MarketplaceStockInfoModalComponent) marketplaceStockInfo: MarketplaceStockInfoModalComponent;

  readonly TSC = 'tsc';
  readonly LZD = 'lazada';

  productClassChanged: boolean;
  emptyStore: boolean;
  showedStore: number;
  isStoreExpanded = false;
  animationState = 'out';
  selectedTab: string;

  warehouseCount = 0;
  storeCount = 0;
  marketplaceCount = 0;

  productSlug: string;
  productClassName: string;
  productClassSlug: string;
  shippingDetail: any;
  warehouseInfoDetail: any;
  marketplaceStoreAttributes: any;

  clientList: IClient[];

  attributes: any[] = [];
  get attributesFormArray(): FormArray { return this.form.get('attributes') as FormArray; }

  constructor(
    protected route: ActivatedRoute,
    protected fb: FormBuilder,
    private mpClientService: MarketplaceClientService,
    private mpItemService: MarketplaceItemService,
  ) {
    super();
  }

  ngOnInit() {
    this.initializeForm();

    this.productSlug = this.route.snapshot.paramMap.get('slug');
    this.mpItemService
      .getItemMarketplaceInformation(this.productSlug)
      .subscribe((data: IMarketplaceItemInformation) => {
        if (data){
          this.warehouseCount = data.totalWarehouse;
          this.marketplaceCount = data.totalMarketplace;
          this.storeCount = data.totalStore;
          this.warehouseInfoDetail = data.details;
        }
      });

    this.mpItemService
      .getItemMarketplaceLogisticInformation(this.productSlug)
      .subscribe((shipping: IMarketplaceItemLogisticInformation) => {
        this.shippingDetail = shipping;
      });

    this.mpClientService
      .client.subscribe((clients: IClient[]) => {
        this.clientList = clients;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.productClassChanged = true;
    const productClassValue = changes.productClass.currentValue.href;
    const slugs = productClassValue.split('/').reverse();
    this.productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.productClassName =  changes.productClass.currentValue.name;
  }

  private initializeForm() {
    this.form = this.fb.group({
      attributes: this.fb.array([]),
    });
  }

  toggleStore(index: number) {
    this.isStoreExpanded = !this.isStoreExpanded;
    this.showedStore = index;
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  getAttributes(marketplace: any) {
    this.emptyStore = false;
    this.productClassChanged = false;
    if (this.selectedTab){
      if (this.selectedTab !== marketplace.toLowerCase()){
        this.saveAll();
      }
    }

    this.selectedTab = marketplace.toLowerCase();
    this.clearFormArray(this.attributesFormArray);

    this.mpItemService
      .getItemMarketplaceAttribute(this.selectedTab, this.productClassSlug, this.productSlug)
      .subscribe((data: IMarketplaceItemAttributeInformation[]) => {
        this.marketplaceStoreAttributes = data;
        if (!data){
          this.emptyStore = true;
        }

        if (!!data) {
          data.forEach((stores: IMarketplaceItemAttributeInformation, index) => {
            stores.attributes.forEach((attr) => {
              this.attributesFormArray.push(
                this.fb.group({
                  name: [attr.name],
                  type: [attr.type],
                  identifier: [attr.identifier],
                  value: [attr.value],
                  option: [attr.option],
                  newValue: null,
                  indexShop: index,
                  marketplaceAttributeName: [attr.marketplaceAttributeName]
                })
              );
            });
          });
        }
    });
  }

  attrChange(value: string, index: number) {
    const attr = this.attributesFormArray.at(index).get('newValue');
    if (value === 'addNewAttr') {
      attr.setValidators(Validators.required);
      attr.setValue(''); // should set string otherwise it will give value addNewAttr
    } else {
      attr.clearValidators();
      attr.reset();
    }
    attr.updateValueAndValidity();
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  saveAll(): void {
    const attr = this.attributesFormArray.value.map((attrVal: any) => {
      let currVal = attrVal.value;
      if (attrVal.newValue !== null){
        currVal = attrVal.newValue;
      }
      return {
        identifier: attrVal.identifier,
        value: currVal,
        product: this.productSlug,
      };
    });
    this.patchAttributes({ attributes: attr});
  }

  patchAttributes(attr: any) {
    this.mpItemService
      .patchItemAttribute(attr, this.productClassSlug.toLowerCase())
      .subscribe(
        (resp) => { },
        (err) => {
          console.log(err);
        }
      );
  }
}
