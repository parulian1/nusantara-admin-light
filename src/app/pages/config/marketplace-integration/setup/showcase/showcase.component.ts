import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { DialogResult, ToastLevelEnum, ToastService } from '@nusantara/core';
import { ConfirmModalComponent } from '@nusantara/shared/confirm-modal.component';
import { SvgIconService } from '@nusantara/services';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceShowcaseService } from '@nusantara/services/marketplace-showcase.service';
import { marketplace } from '@nusantara/models';
import { IShowcaseDetail, IshowcaseProduct } from '@nusantara/models/marketplace';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ShowcaseSelectProductComponent, DeleteShowcaseModalComponent } from './modals';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'nus-showcase-detail',
  template: `
    <h1 class="title-1">{{displayName}}</h1>

    <div class="wrapper">
    <form [formGroup]="form">
        <div class="general-info">
          <h1 class="heading-1" i18n>General Information</h1>
          <div class="box">
            <label>
              <span i18n>Showcase Display Name</span>
              <div class="display-name">
                <input type="text" formControlName="showCaseName">
                <button class="control" (click)="updateShowcaseName()" i18n>
                  Update
                </button>
              </div>
            </label>
          </div>
          <div>
            <label>
              <span i18n>Products</span>
              <p>{{totalProduct}}</p>
            </label>
          </div>
          <div *ngIf="!isDisabled">
            <label>
              <span i18n>Display On/Off</span>
              <div class="switcher">
                <mat-slide-toggle>
                </mat-slide-toggle>
              </div>
            </label>
          </div>
        </div>
      </form>
      <label class="info-showcase" i18n>Showcase is automatically updated after adding or removing products.</label>
      <table class="table-scroll">
        <tr class="button-add">
          <button (click)="productSelectionModal.open()" type="button" class="new-add-button wide" i18n>
            <mat-icon class="icon" svgIcon="add"></mat-icon> Add Product
          </button>
        </tr>
        <thead>
          <tr>
            <th i18n>Product Name</th>
            <th i18n>SKU</th>
            <th class="centered" i18n>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entity of dataProduct; let i=index">
            <td>{{ entity?.name }}</td>
            <td>{{ entity?.upc }}</td>
            <td class="centered">
              <button class="remove" (click)="remove(entity?.marketplaceProductId)">
                <mat-icon class="icon" svgIcon="trash"></mat-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="confirm-action-button">
        <div class="cancel">
          <button class="control" (click)="confirmModal.open()" i18n>
            Back
          </button>
        </div>
        <div class="delete">
          <button class="control" (click)="deleteShowcaseModal.open(showcaseId)" i18n>
            Delete
          </button>
        </div>
      </div>

    </div>
    <!-- Modals -->
    <nus-showcase-product-selection-modal
      [shopSlug]="shopSlug"
      [showcaseId]="showcaseId">
    </nus-showcase-product-selection-modal>
    <nus-confirm-modal
      [title]="confirmTitle"
      [content]="confirmText"
      [okText]="confirmOk"
      [cancelText]="confirmCancel">
    </nus-confirm-modal>
    <nus-delete-showcase-modal></nus-delete-showcase-modal>
  `,
  styles: [
    '.wrapper { display: flex; flex-flow: column; height: 100%; gap: 20px; }',
    `
      .general-info {
        padding: 20px 24px;
        border: solid 1px var(--grey);
        border-radius: 4px;
      }`,
    '.display-name { display: flex; justify-content: space-between; gap: 16px; }',
    'table thead tr th:last-child { padding-right: 22px;}',
    '.table-scroll { display: block; empty-cells: show; }',
    '.table-scroll thead { position: relative; display: block; width: 100%; }',
    `.table-scroll tbody {
        display: block;
        position: relative;
        width: 100%;
        overflow-y: scroll;
        max-height: 75vh;
      }
    `,
    `.info-showcase{min-height:0; padding-bottom: 0;}`,
    '.table-scroll tr { width: auto; display: flex; }',
    `.table-scroll td, .table-scroll th {
        flex-basis: 100%;
        flex-grow: 2;
        display: block;
      }
    `,
    `.confirm-action-button{
        display:inline-block;
        overflow: auto;
        white-space: nowrap;
        margin:0px auto;
        width: 100%;
      }`,
      `.confirm-action-button .cancel{float:left}`,
      `.confirm-action-button .delete{float:right;}`,
      `.delete button{background: white; color: #EA730B}`,
      `.delete button:disabled{background: white; color: #B4B4B4}`,
      /* Slim and rounded scrollbar */
    '::-webkit-scrollbar { width: 8px; }',
    '::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: var(--grey); }',
    '.icon { height: 20px; }',
    '.button-add { padding: 12px; border-bottom: solid 1px var(--grey); }',
    '.remove { background: none; border: none; }',
    'form {max-width: initial !important;}'
  ],
})
export class ShowcaseComponent implements OnInit, AfterViewInit {
  dataProduct: Array<IshowcaseProduct> = []
  shopSlug: string;
  showcaseId: number;
  showcaseDetail:  Array<IShowcaseDetail> = [];
  displayName: string;
  isDisabled: boolean;
  totalProduct: number;

  form: FormGroup;
  @ViewChild(ShowcaseSelectProductComponent) productSelectionModal: ShowcaseSelectProductComponent;
  @ViewChild(ConfirmModalComponent)confirmModal: ConfirmModalComponent;
  @ViewChild(DeleteShowcaseModalComponent)deleteShowcaseModal: DeleteShowcaseModalComponent;

  confirmTitle = "Are You Sure?";
  confirmText =
    "Changes you made on General Information will not be saved if you go back.";
  confirmOk = 'Go Back';
  confirmCancel = 'Cancel Anyway';


  constructor(
    private route: ActivatedRoute,
    private service: MarketplaceShowcaseService,
    private toast: ToastService,
    public fb: FormBuilder,
    public location: Location,
    svgIconService: SvgIconService) {
    svgIconService.registerIcons();
  }

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get("shop-slug");
    this.showcaseId = +this.route.snapshot.paramMap.get("showcase-id");
    if(this.shopSlug!=null && this.showcaseId!=0){
      this.fillFormDetail(this.shopSlug, this.showcaseId)
      this.getProductShowcase(this.shopSlug, this.showcaseId);
    }
    this.initializeForm()
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed())
    this.confirmModal.onClose.subscribe(() => this.onConfirmModalClosed())
    this.deleteShowcaseModal.onClose.subscribe(() =>
      this.ondeleteShowcaseModalClosed()
    );
  }

  get showCaseName(): FormControl {
    return this.form.get('showCaseName') as FormControl;
  }

  initializeForm(entity?: marketplace.IShowcaseDetail) {
    this.form = this.fb.group({
      showCaseName: [entity?.name, [Validators.required]],
    });
  }

  fillFormDetail(shopSlug: string, showcaseId: number) {
    this.service
      .fetchDetail(shopSlug, showcaseId)
      .subscribe((data: marketplace.IShowcaseDetail) => {
        if (data != null) {
          this.form.patchValue({
            showCaseName: data.name,
          });

          console.log(data)
          this.displayName = data.name;
          this.totalProduct = data.total;
          this.isDisabled = data.disable;
        }
      });
  }

  updateShowcaseName(){
    this.service.update(this.shopSlug, this.showcaseId, this.form.value.showCaseName).subscribe(
      (resp) => {
        this.refetch();
        this.toast?.addMessage(
          resp.data.message,
          'Saved',
          ToastLevelEnum.success
        );
      },
      (errorResp) => {
        this.toast?.addMessage(
          errorResp.error.details[0].message,
          'Error',
          ToastLevelEnum.error
        );
      }
    );
  }

  getProductShowcase(shopSlug: string, showcaseId: number){
    this.service.getProductListShowcase(shopSlug, showcaseId).subscribe((data: marketplace.IshowcaseProduct[])=>{
        this.dataProduct = data;
    });
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      const selectedProduct = this.productSelectionModal.product.value as IshowcaseProduct;
      this.service.addProduct(this.shopSlug, this.showcaseId, +selectedProduct.marketplaceProductId).subscribe(
        (resp: any) => {
          console.log(resp);
          this.toast?.addMessage(
            resp.message,
            'Success',
            ToastLevelEnum.success
          );
          this.refetch();
        },
        (errorResp) => {
          this.toast?.addMessage(
            errorResp.error.message,
            'Failed',
            ToastLevelEnum.error
          );
        }
      );;
    }
  }

  onConfirmModalClosed(){
    if(this.confirmModal.result == DialogResult.OK){
      this.location.back();
    }
  }

  ondeleteShowcaseModalClosed() {
    if (this.deleteShowcaseModal.result === DialogResult.OK) {
      const etalaseId = this.deleteShowcaseModal.etalaseId;
      this.service.delete(this.shopSlug, etalaseId).subscribe(
        (resp: HttpResponse<any>) => {
          this.location.back();
        },
        (errorResp: HttpErrorResponse) => {
          this.toast?.addMessage(
            errorResp.error.message,
            'Error',
            ToastLevelEnum.error
          );
        }
      );
    }
  }

  remove(marketplaceProductId: number){
    this.service.removeProduct(this.shopSlug, this.showcaseId, marketplaceProductId).subscribe(
      (resp) => {
        console.log(resp);
        this.toast?.addMessage(
          `Success message.`,
          'Success',
          ToastLevelEnum.success
        );
        this.refetch();
      },
      (error) => {
        this.toast?.addMessage(
          'Error message.',
          'Error',
          ToastLevelEnum.error
        );
      }
    );
  }

  refetch(): void {
    this.fillFormDetail(this.shopSlug, this.showcaseId);
    this.getProductShowcase(this.shopSlug, this.showcaseId);
  }
}
