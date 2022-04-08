import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MarketplaceStockInfoModalComponent,
  MarketplaceShippingInfoModalComponent
} from "@nusantara/shared";
import { marketplace, products } from "@nusantara/models";
import {
  MarketplaceClientService,
  MarketplaceItemService,
} from "@nusantara/services";
import { AbstractEditingComponent } from "@nusantara/core";
import { IClient } from '@nusantara/models/marketplace';
@Component({
  selector: 'nus-marketplace-info',
  template: `
    <div class="wrapper">
      <h1 class="heading-1" i18n>Marketplace Information</h1>
      <div class="subinfo">
        <div class="subheading-2" i18n>Marketplace Publish Summary</div>
        <a (click)="marketplaceStockInfo.open()" i18n>More Detail</a>
      </div>
      <div class="summary">
        <div class="wrapper">
          <p class="body-2" i18n>Warehouse</p>
          <p class="title-1">{{ warehouseCount }}</p>
        </div>
        <div class="wrapper">
          <p class="body-2" i18n>Marketplace</p>
          <p class="title-1">{{ marketplaceCount }}</p>
        </div>
        <div class="wrapper">
          <p class="body-2" i18n>Store</p>
          <p class="title-1">{{ storeCount }}</p>
        </div>
      </div>
      <div class="subinfo">
        <div>
          <h4 class="subheading-2" i18n>Shipping</h4>
          <p i18n>View shipping method for your marketplace stores.</p>
        </div>
        <a (click)="shippingInfo.open();" i18n>More Detail</a>
      </div>
      <div class="subinfo mt-3">
        <div>
          <h4 class="subheading-2" i18n>Marketplace Product Detail</h4>
          <p i18n>This information will be used as specific per marketplace. Skip this if you don't want to publish to marketplace.</p>
        </div>
        <a (click)="edit()">Edit</a>
      </div>
      <div *ngIf="isClientListAvailable" class="detail-store">
        <nus-tabs (select)="getAttributes($event)" [fluid]="true">
          <nus-tab *ngFor="let client of clientList; let marketplaceIndex = index"
            [title]="client.marketplaceName"
            [value]="client.option">
            <ng-container *ngIf="isProductClassMappedAvailable">
              <div *ngIf="isProductClassMapped; else productClassMappingNotFound">
                <ng-container *ngIf="!!itemAttributes; else noConnectedStore">
                  <div *ngFor="let data of itemAttributes; let storeIndex = index">
                    <div class="store">
                      <div>
                        <p class="body-2" i18n>Store</p>
                        <h4 class="subheading-2">{{ data.shop }}</h4>
                      </div>
                      <button type="button" class="expand"
                        (click)="toggleStore(marketplaceIndex, storeIndex)">
                        <i class="material-icons" >{{ isStoreExpanded(marketplaceIndex, storeIndex)? 'expand_less':'expand_more' }}</i>
                      </button>
                    </div>
                    <div *ngIf="isStoreExpanded(marketplaceIndex, storeIndex)">
                      <div *ngIf="data.isMapped; else notMapped">
                        <div *ngIf="data.attributes.length; else noAttribute" class="attr-table" [formGroup]="form">
                          <h4 class="subheading-2" i18n>Attribute</h4>
                          <table>
                            <thead>
                              <th i18n>Name</th>
                              <th i18n>Value</th>
                            </thead>
                            <tbody formArrayName="attributes" *ngIf="attributesFormArray.controls.length">
                              <ng-container *ngFor="let attr of attributesFormArray.controls; let i = index" [formGroupName]="i">
                              <tr *ngIf="storeIndex === attr.value.indexShop">
                                <td>
                                  {{ attr.value.name }}
                                </td>
                                <td>
                                  <div *ngIf="attr.value.type === 'combo box' || attr.value.type === 'dropdown'">
                                    <select #selecteEditAttr formControlName="value"
                                      (change)="attrChange(selecteEditAttr.value, i)">
                                      <option [ngValue]="null">
                                        Select attribute value of {{
                                        attributesFormArray?.controls[i].value.name }}
                                      </option>
                                      <option *ngFor="let opt of attributesFormArray?.controls[i].value.option" [ngValue]="opt">
                                        {{ opt }}
                                      </option>
                                      <option class="add-new-attr" value="addNewAttr" *ngIf="attr.value.type === 'combo box'">
                                        <i class="material-icons">add</i> Add New Attribute
                                      </option>
                                    </select>
                                    <div *ngIf="selecteEditAttr.value === 'addNewAttr'">
                                      <input type="text" formControlName="newValue" />
                                      <div *ngIf="attr.get('newValue').invalid && attr.get('newValue').touched"class="error-detail">
                                        This field is required
                                      </div>
                                    </div>
                                  </div>
                                  <div *ngIf="client.option === LZD && LzdReadOnlyFields.includes(attr.value.marketplaceAttributeName); else defaultInputField">
                                    <input *ngIf="attr.value.type === 'text'" formControlName="value" type="text" readonly/>
                                    <input *ngIf="attr.value.type === 'integer'" formControlName="value" type="number" readonly/>
                                  </div>

                                  <ng-template #defaultInputField>
                                    <input *ngIf="attr.value.type === 'text'" formControlName="value" type="text"/>
                                    <input *ngIf="attr.value.type === 'integer'" formControlName="value" type="number"/>
                                  </ng-template>
                                </td>
                              </tr>
                              </ng-container>
                            </tbody>
                          </table>
                        </div>
                        <ng-template #noAttribute>
                          <div class="no-attribute">
                            <div *ngIf="data.isMapped else notMapped">
                              <h3 class="subheading-1" i18n>Product class doesn't have attribute.</h3>
                            </div>
                          </div>
                        </ng-template>
                      </div>
                      <ng-template #notMapped>
                        <div class="not-mapped">
                          <h1 class="heading-1" i18n>Product Class is Not Mapped Yet!</h1>
                          <p i18n>Map Class to sync your product to marketplace.</p>
                          <button [routerLink]="['/config/marketplace-integration/connect/product-class/',
                                data.shopSlug,
                                productClassSlug
                              ]"
                            [state]="{ productClass: { name: productClassName, slug: productClassSlug } }"
                            type="button"
                            class="control" i18n>Start Mapping
                          </button>
                        </div>
                      </ng-template>
                    </div>
                  </div>
                </ng-container>
                <ng-template #noConnectedStore>
                  <div class="not-connected">
                    <h1 class="heading-1" i18n>No Connected Store Yet!</h1>
                    <p i18n>Add a marketplace store to manage all your products in one place.</p>
                    <button type="button" [routerLink]="['/config/marketplace-integration/connect/new']" class="control" i18n>
                      <i class="material-icons">add</i>Add Store
                    </button>
                  </div>
                </ng-template>
              </div>
            </ng-container>
            <ng-template #productClassMappingNotFound>
              <div class="not-mapped">
                <h1 class="heading-1" i18n>Product Class is Not Mapped Yet!</h1>
                <p i18n>Map Class to sync your product to marketplace.</p>
                <button [routerLink]="['/config/marketplace-integration/connect/']"
                  type="button"
                  class="control" i18n>Start Mapping
                </button>
              </div>
            </ng-template>
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
    '.attr-table { padding: 16px 12px; border-bottom: solid 1px var(--grey); }',
    `.not-connected, .not-mapped, .no-attribute {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
        border-bottom: solid 1px var(--grey); }
      `,
    '.not-connected h1, .not-mapped h1 { margin-bottom: 10px; }',
    '.not-connected p, .not-mapped p { color : var(--grey); margin-bottom: 24px; }',
    '.not-connected button, .not-mapped button { display: flex; justify-content: center; align-items: center; }',
    '.not-connected button > i, .not-mapped button > i { font-size: 20px; }',
    '.add-new-attr { font-weight: 600; font-size: 16px; }',
  ]
})
export class MarketplaceInfoHostComponent extends AbstractEditingComponent<FormGroup> implements OnInit, OnChanges {

  @Input() form: FormGroup;
  @Input() id:number
  @Input() productClass: products.IProductClass;

  @ViewChild(MarketplaceShippingInfoModalComponent) shippingInfo: MarketplaceShippingInfoModalComponent;
  @ViewChild(MarketplaceStockInfoModalComponent) marketplaceStockInfo: MarketplaceStockInfoModalComponent;

  readonly TSC = 'tsc';
  readonly LZD = 'lazada';

  // Lazada readonly field
  LzdReadOnlyFields = ['SellerSku', 'price'];

  warehouseCount = 0;
  storeCount = 0;
  marketplaceCount = 0;

  productSlug: string;
  productClassName: string;
  productClassSlug: string;
  shippingDetail: any;
  warehouseInfoDetail: any;
  itemAttributes: any;
  selectedTab: string;

  clientList: Array<marketplace.IClient>;
  isClientListAvailable = false;
  isProductClassMapped: boolean;
  isProductClassMappedAvailable = false;

  get attributesFormArray(): FormArray { return this.form.get('attributes') as FormArray; }

  isExpanded: Array<{ client: string; expanded: Array<boolean> }> = [];

  constructor(
    protected route: ActivatedRoute,
    protected fb: FormBuilder,
    private router: Router,
    private cdRef: ChangeDetectorRef,
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
      .subscribe((data: marketplace.IItemInfo) => {
        if (data){
          this.warehouseCount = data.totalWarehouse;
          this.marketplaceCount = data.totalMarketplace;
          this.storeCount = data.totalStore;
          this.warehouseInfoDetail = data.details;
        }
      });

    this.mpItemService
      .getItemMarketplaceLogisticInformation(this.productSlug)
      .subscribe((shipping: marketplace.IItemLogisticInfo) => {
        this.shippingDetail = shipping;
      });

      setTimeout(() => {
        this.mpClientService.client.subscribe(
          (clients: marketplace.IClient[]) => {
            this.clientList = clients;
            this.clientList.map((client: IClient) => {
              this.isExpanded.push({ client: client.option, expanded: null });
            });
            this.isClientListAvailable = true;
          }
        );
      });
  }

  private initializeForm() {
    this.form = this.fb.group({
      attributes: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const productClassValue = changes.productClass.currentValue.href;
    const slugs = productClassValue.split('/').reverse();
    this.productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.productClassName =  changes.productClass.currentValue.name;

    this.getAttributes(this.selectedTab);
  }

  getAttributes(marketplaceOption: string) {
    if (
      this.selectedTab &&
      this.selectedTab !== marketplaceOption &&
      this.itemAttributes
    ) {
      this.saveAll();
      this.isProductClassMappedAvailable = false;
    }

    this.clearFormArray(this.attributesFormArray);

    this.mpItemService
      .getItemMarketplaceAttribute(
        marketplaceOption,
        this.productClassSlug,
        this.productSlug
      )
      .subscribe((data: marketplace.IItemAttributeInfo[]) => {
        // if not return 404 means product class already mapped
        this.isProductClassMapped = true;

        if (!!data) {
          this.itemAttributes = data;
          data.forEach((stores: marketplace.IItemAttributeInfo, index) => {
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
                  marketplaceAttributeName: [attr.marketplaceAttributeName],
                })
              );
            });
          });

          // fill value for isExpanded
          const index = this.isExpanded.findIndex(
            (obj) => obj.client === marketplaceOption
          );
          this.isExpanded[index].expanded = Array(data.length).fill(false);
        } else {
          this.itemAttributes = null;
        }
      },
      // for error fetch data i.e 404 not found
      () => {
        this.isProductClassMapped = false;
        this.itemAttributes = null;
      });

    this.isProductClassMappedAvailable = true;
    this.selectedTab = marketplaceOption;
    this.cdRef.detectChanges();
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
    if(!!formArray) {
      while (formArray.length !== 0) {
        formArray.removeAt(0);
      }
    }
  }

  edit(){
    this.id.toString()
    this.router.navigateByUrl(`/catalog/products/${this.id}/marketplace/edit`, )
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

  toggleStore(marketplaceIndex: number, storeIndex: number) {
    this.isExpanded[marketplaceIndex].expanded[storeIndex] = !this.isExpanded[marketplaceIndex].expanded[storeIndex];
  }

  isStoreExpanded(marketplaceIndex: number, storeIndex: number): boolean {
    if(!!this.isExpanded[marketplaceIndex].expanded) {
      return this.isExpanded[marketplaceIndex].expanded[storeIndex];
    } else {
      return false;
    }
  }
}
