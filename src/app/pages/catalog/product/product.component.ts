import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {SlideInOutAnimation} from '@nusantara/shared';
import { ToastService, AbstractDetailComponent, PagedResponse, getSlugFromHref, NusantaraValidators, ErrorResult } from '@nusantara/core';
import {
  ICategory,
  IVendor,
  drf,
  products,
  IMarketplaceItemAttributeInformation,
  IShopAttributeMapping, IMarketplaceItemLogisticInformation, IMarketplaceItemInformation, IClient
} from '@nusantara/models';
import { IError } from '@nusantara/models/base/error';
import {MarketplaceClientService, ProductService} from '@nusantara/services';
import { PriceListHostComponent } from './price';
import { ProductMediaHostComponent } from './media';
import { ProductAttributeHostComponent } from './attribute';
import { ProductSubscriptonHostComponent } from './subscription';
import {MarketplaceInfoDetailProductPageComponent} from "../../../shared/marketplace-info-detail-product-page.component";
import {MarketplaceInfoShippingModalComponent} from "../../../shared/marketplace-info-shipping-modal.component";
import {ProductSelectionModalComponent} from "../../../shared";
import {MarketplaceClientEnum} from "../../config/marketplace-integration/setup/markeplace-client-enum";
import {MarketplaceItemService} from "../../../services/marketplace-item.service";

/**
 * Allows the user to edit/create a single product.
 */
@Component({
  selector: 'nus-product',
  animations: [SlideInOutAnimation],
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Product">
    </nus-detail-title>

    <div class="main-container">
      <div>
        <nus-non-field-errors
          [nonFieldErrors]="nonFieldErrors"
        ></nus-non-field-errors>

        <form [formGroup]="form" (ngSubmit)="save()" class="entity-detail-form">
          <div id="general-info" class="wrapper">
            <h3>General Information</h3>

            <label>
              <span>Name</span>
              <input type="text" [formControl]="name" />
              <nus-field-errors [control]="name"></nus-field-errors>
            </label>
            <label>
              <span>Is Active</span>
              <input type="checkbox" [formControl]="isActive">
              <nus-field-errors [control]="isActive"></nus-field-errors>
            </label>

            <label *ngIf="structure.value === 'parent'">
              <span>Category</span>
              <div class="manage-section">
                <div>
                  <select [formControl]="category">
                    <option *ngFor="let c of categories" [ngValue]="c.href">
                      {{ c.pathName }}
                    </option>
                  </select>
                  <nus-field-errors [control]="category"></nus-field-errors>
                </div>
                <div>
                  <a [routerLink]="['/catalog', 'categories']" class="manage">
                    Manage Category
                  </a>
                </div>
              </div>
            </label>

            <label *ngIf="structure.value === 'parent'">
              <span>Product Class</span>
              <div class="manage-section">
                <div>
                  <select [formControl]="productClass" (change)="onChangeProductClass($event)">
                    <option
                      *ngFor="let pc of productClasses"
                      [ngValue]="pc.href"
                    >
                      {{ pc.name }}
                    </option>
                  </select>
                  <nus-field-errors [control]="productClass"></nus-field-errors>
                </div>
                <div>
                  <a
                    [routerLink]="['/catalog', 'product-classes']"
                    class="manage"
                  >
                    Manage Class
                  </a>
                </div>
              </div>
            </label>

            <nus-product-attribute-host
              [form]="attributes"
              [productClass]="productClass"
              [originalAttributeValues]="originalAttributeValues"
              *ngIf="originalAttributeValues"
            >
            </nus-product-attribute-host>
            <a *ngIf="productClass?.value" (click)="goToAttribute()" class="manage"
              >Manage Attribute</a
            >
          </div>

          <div id="product-info" class="wrapper">
            <h3>Product Information</h3>

            <div class="rich-text-container">
              <label for="content" class="external"
                ><span>Description</span></label
              >
              <ckeditor
                [editor]="Editor"
                [formControl]="description"
                id="description"
              ></ckeditor>
              <nus-field-errors [control]="description"></nus-field-errors>
            </div>

            <label *ngIf="structure.value === 'parent'">
              <span>Vendor</span>
              <div class="manage-section">
                <div>
                  <select [formControl]="vendor">
                    <option *ngFor="let v of vendors" [ngValue]="v.href">
                      {{ v.name }}
                    </option>
                  </select>
                  <nus-field-errors [control]="vendor"></nus-field-errors>
                </div>
                <div>
                  <a [routerLink]="['/catalog', 'vendors']" class="manage">
                    Manage Vendor
                  </a>
                </div>
              </div>
            </label>
          </div>

          <div id="product-management" class="wrapper">
            <h3>Product Management</h3>
            <ng-template [ngIf]="structure.value === 'parent'">
              <label>
                <span>Variants</span>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let v of variants">
                      <td>
                        <a [routerLink]="['variants', v.href | entityToSlug]">{{
                          v.name
                        }}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button
                          [disabled]="isNew"
                          (click)="addVariant()"
                          type="button"
                          class="add-button"
                        >
                          <i class="material-icons">add</i> Add Variant
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </label>
            </ng-template>

            <label>
              <span>UPC</span>
              <input type="text" [formControl]="upc" />
              <nus-field-errors [control]="upc"></nus-field-errors>
            </label>

            <nus-price-list-host [form]="priceLists"></nus-price-list-host>
          </div>

          <div id="product-media" class="wrapper">
            <h3>Media</h3>
            <nus-product-media-host [form]="media"></nus-product-media-host>
          </div>

          <div id="product-packaging" class="wrapper">
            <h3>Product Packaging</h3>
            <label>
              <span>Package Weight (kg)</span>
              <input type="number" [formControl]="weight" placeholder="Input Weight" />
              <nus-field-errors [control]="weight"></nus-field-errors>
            </label>
            <div id="product-dimension" class="flex-container no-margin" formGroupName="dimensions">
                <label>
                  <span>Length (cm)</span>
                  <input type="number" class="dimension-input" formControlName="current_length" placeholder="Input Length" />
                  <nus-field-errors [control]="length"></nus-field-errors>
                </label>
                <label>
                  <span>Width (cm)</span>
                  <input type="number" class="dimension-input" formControlName="current_width" placeholder="Input Width" />
                  <nus-field-errors [control]="width"></nus-field-errors>
                </label>
                <label>
                  <span>Height (cm)</span>
                  <input type="number" class="dimension-input" formControlName="current_height" placeholder="Input Height" />
                  <nus-field-errors [control]="height"></nus-field-errors>
                </label>
            </div>
          </div>

          <div id="product-tag" class="wrapper">
            <h3>Product Tag</h3>
            <table>
                <thead>
                  <tr>
                    <th>Tag</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of tags.controls; let i = index">
                    <td>
                      <input type="text" [formControl]="t" />
                    </td>
                    <td>
                      <button
                        type="button"
                        class="remove-button"
                        (click)="tags.removeAt(i)"
                      >
                        <i class="material-icons">remove_circle_outline</i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <button (click)="addTag()" type="button" class="add-button">
                        Add Tag
                      </button>
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>

          <div id="product-other" class="wrapper">
            <h3>Other</h3>
              <label>
                  <span>Meta Description</span>
                  <textarea [formControl]="seoDescription" id="" cols="30" rows="10"></textarea>
                  <nus-field-errors [control]="seoDescription"></nus-field-errors>
              </label>
              <label>
                  <span>Meta Keywords</span>
                  <input type="text" [formControl]="seoMeta" />
                  <nus-field-errors [control]="seoMeta"></nus-field-errors>
              </label>
              <label>
              <span>Variants</span>
              <div *ngIf="structure.value === 'parent'" class="no-margin">
                  <p>Create product SKUs that are similar to this product.</p>
                  <table>
                      <thead>
                          <tr>
                            <th>Name</th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let v of variants">
                          <td>
                            <a [routerLink]="['variants', v.href | entityToSlug]">{{
                              v.name
                            }}</a>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <button
                              [disabled]="isNew"
                              (click)="addVariant()"
                              type="button"
                              class="add-button"
                            >
                              Add Variant
                            </button>
                          </td>
                        </tr>
                      </tbody>
                  </table>
                </div>
              </label>
          </div>

          <div id="marketplace-information" class="wrapper" *ngIf="!isNew">
            <h3>Marketplace Information</h3>
              <div class="small-margin">
                <span class="span-mp-size">Marketplace Publish Summary
                  <button type="button" (click)="showMarketplaceDetail()" class="detail-button">More Detail</button>
                </span>
              </div>
              <div class="flex-container no-margin">
                  <div class="mp-info">
                    <p>Warehouse</p>
                    <p class="span-bold-big-size">{{warehouseValue}}</p>
                  </div>
                  <div class="mp-info">
                    <p>Marketplace</p>
                    <p class="span-bold-big-size">{{marketplaceValue}}</p>
                  </div>
                  <div class="mp-info">
                    <p>Store</p>
                    <p class="span-bold-big-size">{{storeValue}}</p>
                  </div>
              </div>
              <div class="big-margin">
                <span class="span-mp-size">Shipping
                    <button type="button" (click)="showShippingDetail()" class="detail-button shipping-detail">More Detail</button>
                </span>
                <p>View shipping method for your marketplace stores.</p>
              </div>
              <div class="big-margin">
                <span class="span-mp-size">Marketplace Product Detail</span>
                <p>This information will be used as specific per marketplace. Skip this if you don't want to publish to marketplace.</p>
              </div>
              <div class="big-margin">
                <nus-tabs (OutPutTitle)="getAttributeOfMarketplace($event)">
                  <nus-tab *ngFor="let data of clientList" [title]="data.marketplaceName">
                    <div class="marketplace-container">
                      <div *ngIf="!hideOnChangeProductClass">
                        <div *ngFor="let data of marketplaceStoreAttributes; let x = index;">
                          <div class="shop-slider" (click)="toggleShowDiv(x)">
                              <h3>Store <i class="arrow down"></i></h3>
                              <span>{{data.shop}}</span>
                          </div>
                          <div [@slideInOut]="animationState" *ngIf="showDivIndex === x" class="slider-body">
                            <div class="slider-table" *ngIf="data.attributes.length; else ElseNoAttributeMatching">
                              <table>
                                <thead>
                                  <th>Attribute</th>
                                  <th>Value</th>
                                </thead>
                                <tbody>
                                    <ng-container formArrayName="marketplaceAttributes">
                                       <tr
                                        *ngFor="let attr of marketplaceAttributes.controls; let i = index"
                                        [formGroupName]="i"
                                       >
                                           <td *ngIf="x === marketplaceAttributes.controls[i].value.indexShop">
                                             <input type="text" class="mp-readonly" formControlName="name" readonly />
                                           </td>
                                           <td *ngIf="x === marketplaceAttributes.controls[i].value.indexShop">
                                             <div *ngIf="marketplaceAttributes.controls[i].value.type === 'combo box' ||
                                                     marketplaceAttributes.controls[i].value.type === 'dropdown'">
                                             <select #selecteEditAttr
                                                     formControlName="value"
                                                     (change)="attrChange(selecteEditAttr.value, i)"
                                             >
                                                <option [ngValue]="null">Select attribute value of {{marketplaceAttributes?.controls[i].value.name}}</option>
                                                <option *ngFor="let opt of marketplaceAttributes?.controls[i].value.option" [ngValue]="opt">{{opt}}</option>
                                                <option class="add-new-attr" value="addNewAttr" *ngIf="marketplaceAttributes.controls[i].value.type === 'combo box'">+ Add New Attribute</option>
                                             </select>
                                               <div *ngIf="selecteEditAttr.value === 'addNewAttr'" class="mp-input">
                                                 <input type="text" formControlName="newvalue" />
                                                 <div
                                                   *ngIf="
                                                      marketplaceAttributes.controls[i].get('newvalue').invalid &&
                                                      marketplaceAttributes.controls[i].get('newvalue').touched
                                                    "
                                                   class="error-detail"
                                                 >
                                                   This field is required
                                                 </div>
                                               </div>
                                             </div>
                                             <input formControlName="value" type="text" *ngIf="marketplaceAttributes.controls[i].value.type === 'text'">
                                           </td>
                                       </tr>

                                    </ng-container>
                                </tbody>
                              </table>
                            </div>
                            <ng-template #ElseNoAttributeMatching>
                                <div class="slider-table">
                                  <div class="no-attribute-mapping">
                                    <h1 class="bold-text">No Mapping Class Yet!</h1>
                                    <span>Map Class  to sync your product to Marketplace</span>
                                    <button [routerLink]="['/config/marketplace-integration/setup/product-class/', data.shopSlug, productClassSlug]"
                                            [state]="{ productClass: {name: productClassName} }"
                                            type="button" class="control primary-button">
                                      <i class="material-icons">add</i>Set  Up Store
                                    </button>
                                  </div>
                                </div>
                            </ng-template>
                          </div>
                      </div>
                      </div>
                      <div *ngIf="showNoSlider" class="no-attribute-mapping">
                        <h1 class="bold-text">No Connected Store Yet!</h1>
                        <span>Add a marketplace store to manage all your products in one place.</span>
                        <button type="button" [routerLink]="['/config/marketplace-integration/setup/connect/new']" class="control primary-button">
                          <i class="material-icons">add</i>Add Store
                        </button>
                      </div>
                    </div>
                  </nus-tab>
                </nus-tabs>
              </div>
          </div>
          <div class="wrapper">
            <ng-container *ngIf="!!entity">
              <nus-stock-search [productHref]="entity?.href" ></nus-stock-search>
            </ng-container>
          </div>

          <div class="detail-actions">
            <button type="button" (click)="delete()" *ngIf="!isNew" class="control danger">Delete</button>
            <button type="button" (click)="navigateToParent(true)" class="control secondary">Cancel</button>
            <button type="submit" [disabled]="!form.valid" class="control">Save</button>
          </div>
        </form>
      </div>
      <div class="side-navigation">
        <ul>
          <li [ngClass]="{ active: currentActive === 'general-info' }">
            <a (click)="scrollTo('general-info')">General Information</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-info' }">
            <a (click)="scrollTo('product-info')">Product Information</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-management' }">
            <a (click)="scrollTo('product-management')">Product Management</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-media' }">
            <a (click)="scrollTo('product-media')">Media</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-packaging' }">
            <a (click)="scrollTo('product-packaging')">Product Packaging</a>
          </li>
          <li [ngClass]="{ active: currentActive === 'product-tag' }">
            <a (click)="scrollTo('product-tag')">Product Tag</a>
          </li>
          <li>Other</li>
          <li [ngClass]="{ active: currentActive === 'marketplace-information' }">
            <a (click)="scrollTo('marketplace-information')">Marketplace Information</a>
          </li>
        </ul>
      </div>
    </div>
    <nus-marketplace-info-shipping-modal [shippingDetail]="shippingDetail"></nus-marketplace-info-shipping-modal>
    <nus-marketplace-info-detail-product-page [warehouseInfoDetail]="warehouseInfoDetail"></nus-marketplace-info-detail-product-page>
  `,
  styles: [
    `
      /* double standard label padding */
      .rich-text-container {
        padding-bottom: 14px;
        margin: 0 !important;
      }

      .main-container {
        display: grid;
        grid-template-columns: 3fr 1fr;
        grid-gap: 24px;
        padding: 12px;
      }

      .mp-readonly{
        border: none !important;
      }

      .mp-input{
        margin: 0!important;
      }

      .mp-input input{
        width: 100% !important;
      }

      .bold-text{
        font-weight: 700;
      }

      .primary-button{
        background: #365DC3;
        color: white;
        display: flex ;
        align-items: center;
        justify-content: center;
        width: 188px;
        height: 56px;
        border-radius: 4px;
        margin: 24px auto;
        cursor: pointer;
      }

      .no-attribute-mapping{
        text-align: center;
      }

      table{
        box-shadow: none;
        border: 1px solid #e7e7e7;
        margin: 0 auto;
        background: white;
        border-collapse:collapse;
      }

      table th{
        border-bottom: 1px solid #e7e7e7;
      }

      table th{
        padding: 12px 24px 12px 24px;
      }

      table td{
        padding: 24px;
        width: 50%;
      }

      table tr{
        border-bottom: none;
      }

      .slider-body{
        background: #F4F4F4;
      }

      .shop-slider{
        cursor: pointer;
        border: 1px solid #e7e7e7;
        padding: 16px 24px 24px;
      }

      .slider-table{
        padding:24px;
      }

      .shop-slider h3{
        margin: 0 !important;
        font-weight: normal !important;
        font-size: 12px !important;
        color: black !important;
      }

      .shop-slider span{
        margin: 0 !important;
        font-weight: 700 !important;
        font-size: 14px !important;
      }

      .arrow {
        float: right;
        margin-top: 12px;
        border: solid black;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
      }

      .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
      }

      .left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
      }

      .up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
      }

      .down {
        transform: rotate(45deg);<nus-spinner [appBusy]="isBusy"></nus-spinner>
        -webkit-transform: rotate(45deg);
      }

      .entity-detail-form {
        max-width: 1200px;
      }

      .wrapper {
        border: 1px solid #e7e7e7;
        border-radius: 8px;
        padding: 16px 24px 24px;
        margin-bottom: 24px !important;
      }

      .wrapper h3 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 14px;
        color: #365dc3;
      }

      .wrapper label {
        margin-bottom: 10px;
      }

      .wrapper span {
        margin-bottom: 5px;
        color: #282828;
      }

      .wrapper input[type="text"],
      select {
        height: 40px;
        border-radius: 4px;
        width: 100%;
        background: #ffffff;
      }

      label span {
        font-size: 16px;
        font-weight: 400;
      }

      .manage {
        display: block;
        padding: 12px 30px;
        background: #5a5a5a;
        color: #ffffff;
        border-radius: 4px;
        text-decoration: none;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .manage-section {
        display: flex;
        align-items: center;
        margin: 0 !important;
      }

      .manage-section > div {
        flex: 1 1 auto;
        margin: 0 !important;
      }

      .manage-section > div:first-child {
        margin-right: 20px !important;
        flex-grow: 4;
      }

      .manage-section > div:last-child {
        width: 100px;
      }

      .flex-container {
        display: flex;
      }

      .flex-container div {
        flex: 1 1 auto;
        flex-grow: 1;
        margin: 0 12px;
      }

      ul {
        margin: 0;
        list-style: none;
        padding-inline-start: 0;
      }

      li {
        font-size: 16px;
        font-weight: 700;
        color: #5a5a5a;
        padding: 16px 24px;
        border-radius: 8px;
        margin-bottom: 5px;
        cursor: pointer;
      }

      li.active {
        color: #ff7d09;
        background: #f4f4f4;
      }

      li a {
        text-decoration: none;
        color: inherit;
      }

      .add-button {
        border: 2px solid #5a5a5a;
        border-radius: 4px;
        display: block;
        color: #5a5a5a;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        height: 40px;
        opacity: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .material-icons {
        font-size: 18px;
        padding-right: 2px;
      }

      .add-button:hover:not([disabled]), .add-button:focus:not([disabled]) {
        color: #5a5a5a;
      }

      table {
        box-shadow: none;
        border: 3px solid #f4f4f4;
        border-collapse: separate;
        border-radius: 8px;
        border-spacing: 0;
        margin-bottom: 10px;
      }

      thead {
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
        background: #f4f4f4;
        color: #5a5a5a;
      }

      th {
        padding: 16px;
        text-align: left;
      }

      .mp-readonly{
        border: none !important;
      }

      .mp-input{
        margin: 0!important;
      }

      .mp-input input{
        width: 100% !important;
      }

      .bold-text{
        font-weight: 700;
      }

      .primary-button{
        background: #365DC3;
        color: white;
        display: flex ;
        align-items: center;
        justify-content: center;
        width: 188px;
        height: 56px;
        border-radius: 4px;
        margin-left: auto !important;
        cursor: pointer;
      }

      .no-attribute-mapping{
        text-align: center;
      }

      table{
        box-shadow: none;
        border: 1px solid #e7e7e7;
        margin: 0 auto;
        background: white;
        border-collapse:collapse;
      }

      table th{
        border-bottom: 1px solid #e7e7e7;
      }

      table th{
        padding: 12px 24px 12px 24px;
      }

      table td{
        padding: 24px;
        width: 50%;
      }

      table tr{
        border-bottom: none;
      }

      .slider-body{
        background: #F4F4F4;
      }

      .shop-slider{
        cursor: pointer;
        border: 1px solid #e7e7e7;
        padding: 16px 24px 24px;
      }

      .slider-table{
        padding:24px;
      }

      .shop-slider h3{
        margin: 0 !important;
        font-weight: normal !important;
        font-size: 12px !important;
        color: black !important;
      }

      .shop-slider span{
        margin: 0 !important;
        font-weight: 700 !important;
        font-size: 14px !important;
      }

      .arrow {
        float: right;
        margin-top: 12px;
        border: solid black;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
      }

      .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
      }

      .left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
      }

      .up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
      }

      .down {
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
      }

      #product-dimension > label{
        margin-right: 16px;
      }

      #product-dimension > label > input{
        width: 364px !important;
      }

      .mp-info{
        border-radius: 8px;
        border: 1px solid #c1c1c1;
        margin-left: 24px;
        text-align: center;
        color: #5A5A5A;
      }

      .span-mp-size{
        font-size: 16px !important;
        font-weight: 700;
      }

      .span-bold-big-size{
        font-size: 28px;
        font-weight: 700;
      }

      textarea{
        resize: none;
      }

      .no-margin{
        margin: 0 !important;
      }

      .small-margin{
        margin-bottom: 10px !important;
        margin-top: 10px !important;
      }

      .big-margin{
        margin-top: 20px !important;
        margin-bottom: 25px !important;
      }
      .detail-button{
        float: right;
        background:none;
        border:none;
        margin:0;
        padding:0;
        cursor: pointer;
        color: #FF7D09;
        font-weight: 700;
        font-size: 14px;
      }

      .shipping-detail{
        margin-top: 20px !important;
      }
      .store-card{
        width: 100%;
        background: #FFFFFF;
        border: 2px solid #e7e7e7;
        height: 60px;
      }

      .detail-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 100px !important;
      }

      .mp-control {
        border: solid 2px #365dc3;
        border-radius: 4px;
        height: 40px;
        font-weight: 700;
        font-size: 14px;
        text-decoration: none;
        width: 100%;
        max-width: 212px;
        cursor: pointer;
      }

      .mp-primary {
        background: #365dc3;
        color: white;
      }

      .mp-secondary {
        background: white;
        color: #365dc3;
      }

      .mp-danger {
        border: none;
        background: none;
        color: #c83228;
      }

      button:disabled {
        border: none;
        background: #b4b4b4;
        color: white;
      }

      button:not(:first-child) {
        margin-left: 15px;
      }
    `
  ]
})
export class ProductComponent extends AbstractDetailComponent<products.IProduct> implements OnInit, AfterViewInit {

  productClasses: Array<products.IProductClass>;
  productClassSlug: string;
  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  attribute: Array<products.IProductAttribute>;
  mediaTypes: Array<drf.IChoice>;
  parentProduct: products.IProduct;
  variants: Array<products.IVariantSummary> = [];
  originalAttributeValues: {[key: string]: string|number|boolean};
  entity: products.IProduct;
  currentActive = 'general-info';
  warehouseValue: number=0;
  storeValue:number=0;
  marketplaceValue:number=0;
  productSlug: string;
  shippingDetail: any;
  warehouseInfoDetail: any;
  marketplaceStoreAttributes: any;
  visible: boolean;
  animationState = 'out';
  Editor = ClassicEditor;
  clientList: IClient[];
  marketplaceClient = MarketplaceClientEnum;
  productClassEntity: IShopAttributeMapping;
  productClassName: string;
  showNoSlider: boolean;
  showDivIndex: number;
  isBusy: boolean;
  isComboBox: boolean;
  isDropDown: boolean;
  detailAttributes: string[];
  isInput: boolean;
  currentMarketpalce: string;
  showAttribute: number;

  @ViewChild(ProductMediaHostComponent) mediaHost!: ProductMediaHostComponent;
  @ViewChild(PriceListHostComponent) priceListHost!: PriceListHostComponent;
  @ViewChild(ProductAttributeHostComponent) attributeHost!: ProductAttributeHostComponent;
  @ViewChild(ProductSubscriptonHostComponent) subscriptionHost!: ProductSubscriptonHostComponent;
  @ViewChild(MarketplaceInfoShippingModalComponent) shippingModalComponent: MarketplaceInfoShippingModalComponent;
  @ViewChild(MarketplaceInfoDetailProductPageComponent) marketplaceInfo: MarketplaceInfoDetailProductPageComponent;
  hideOnChangeProductClass: boolean;

  constructor(service: ProductService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public toast: ToastService,
              public router: Router,
              public clientService: MarketplaceClientService,
              public itemService: MarketplaceItemService,
              public modal: NgxSmartModalService) {
    super(route, router, toast, service);
  }
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;



  get name(): FormControl { return this.form.get('name') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get upc(): FormControl { return this.form.get('upc') as FormControl; }
  get productClass(): FormControl { return this.form.get('productClass').get('href') as FormControl; }
  get category(): FormControl { return this.form.get('category').get('href') as FormControl; }
  get vendor(): FormControl { return this.form.get('vendor').get('href') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get media(): FormArray { return this.form.get('media') as FormArray; }
  get priceLists(): FormArray { return this.form.get('priceLists') as FormArray; }
  get attributes(): FormGroup { return this.form.get('attributes') as FormGroup; }
  get related(): FormArray { return this.form.get('related') as FormArray; }
  get weight(): FormControl { return this.form.get('weight') as FormControl; }
  get length(): FormControl { return this.form.get('length') as FormControl; }
  get width(): FormControl { return this.form.get('width') as FormControl; }
  get height(): FormControl { return this.form.get('height') as FormControl; }
  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get structure(): FormControl { return this.form.get('structure') as FormControl; }
  get tags(): FormArray { return this.form.get('tags') as FormArray; }
  get seoMeta(): FormControl { return this.form.get('seoMeta') as FormControl; }
  get seoDescription(): FormControl { return this.form.get('seoDescription') as FormControl; }
  get subscription(): FormControl { return this.form.get('subscription') as FormControl; }
  get marketplaceAttributes() {return this.form.get('marketplaceAttributes') as FormArray;}
  get dimensions() {return this.form.get('dimension') as FormArray;}

  get isProductOptionDomain(): boolean {
    const pc = this.productClasses.filter(e => e.href === (this.form.get('productClass').get('href') as FormControl)?.value)[0];
    if (pc && (pc.type === 'subscription' && pc.option)) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.hideOnChangeProductClass = false;
    this.showNoSlider = false;
    this.route.data.subscribe((
      data: { entity: products.IProduct, categories: ICategory[], parent: products.IProduct, vendors: PagedResponse<IVendor>,
        productClasses: products.IProductClass[], mediaTypes: drf.IChoice[]}) => {
      this.parentProduct = data.parent;
      this.vendors = data.vendors.entities;
      this.categories = data.categories;
      this.productClasses = data.productClasses;
      this.mediaTypes = data.mediaTypes;
      this.entity = data.entity;
    });
    this.visible = false;

    if (this.isNew){
      this.productSlug = this.route.snapshot.paramMap.get('slug')
      this.itemService
        .getItemMarketplaceInformation(this.productSlug)
        .subscribe((data: IMarketplaceItemInformation) => {
          this.warehouseValue = data.totalWarehouse;
          this.marketplaceValue = data.totalMarketplace;
          this.storeValue = data.totalStore;
          this.warehouseInfoDetail = data.details;
        });


      this.itemService
        .getItemMarketplaceLogisticInformation(this.productSlug)
        .subscribe((data: IMarketplaceItemLogisticInformation) => {
          this.shippingDetail = data;
        });

      this.clientService
        .client.subscribe((data: IClient[]) => {
          this.clientList = data;
        });
    }

    this.route.data.subscribe((data: { entity: products.IProduct }) => {
      this.initializeForm(data.entity);
      this.setOriginalEntityName(data.entity);
    });
  }

  /**
   * Configures the form that is edited in this component.
   *
   * Special notes related to the ProductComponent:
   * 1. There is differing logic depending on whether we're initializing a parent or a child (variant)
   * 2. From a parent, the variants array is READ-ONLY at the API, so we DO NOT set it on this form.
   */
  initializeForm(entity?: products.IProduct) {

    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(120), ]],
      isActive: [entity?.isActive, []],
      parent: [entity?.parent ],
      href: [entity?.href],
      upc: [entity?.upc, [Validators.required, ]],
      structure: [entity?.structure ?? 'parent', [Validators.required, ]],
      description: [entity?.description, [Validators.required, ]],
      weight: [entity?.weight, [Validators.required, ]],
      dimensions: this.fb.group({
        current_length:[entity?.dimensions.currentLength,],
        current_width:[entity?.dimensions.currentWidth,],
        current_height:[entity?.dimensions.currentHeight,]
      }),
      productClass: this.fb.group({href: [entity?.productClass.href, [Validators.required]]}),
      category: this.fb.group({href: [entity?.category.href, [Validators.required]]}),
      vendor: this.fb.group({href: [entity?.vendor?.href, [Validators.required]]}),
      media: this.fb.array([]),
      attributes: this.fb.group({}, []),
      marketplaceAttributes: this.fb.array([]),
      priceLists: this.fb.array([]),
      related: this.fb.array([]),
      seoMeta: [entity?.seoMeta, []],
      seoDescription: [entity?.seoDescription, []],
      tags: this.fb.array([], [NusantaraValidators.preventArrayDuplicates(), ]),
      subscription: this.fb.group({}, []),
    });

    // new product variant
    if (!entity && !!this.parentProduct) {
      this.parent.setValue(this.parentProduct.href);
      this.structure.setValue('child');

      // mandatory inheritance from parent
      this.productClass.setValue(this.parentProduct.productClass.href);
      this.category.setValue(this.parentProduct.category.href);
      this.vendor.setValue(this.parentProduct.vendor.href);

      // optional inheritance from parent
      this.description.setValue(this.parentProduct.description);
    }

    this.variants = entity?.variants ?? [];
    this.originalAttributeValues = entity?.attributes ?? {};

    for (const relatedProduct of entity?.related ?? []) {
      this.related.push(
        this.fb.control({
          name: [relatedProduct.name],
          href: [relatedProduct.href],
          image: [relatedProduct.image],
          vendor: [relatedProduct.vendor],
        })
      );
    }

    for (const t of entity?.tags ?? []) {
      this.addTag(t);
    }

    // listen for any changes to this so we can disable weight when appropriate
    this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));
    this.onProductClassChanged(this.productClass.value?.href ?? this.productClass.value );
  }

  initializeSubViewForms(entity?: products.IProduct) {
    for (const priceList of entity?.priceLists ?? []) {
      this.priceListHost.addPriceList(priceList);
    }
    // if the product doesn't have a pricelist, we automatically add one.
    if (!entity?.priceLists.length) {
      this.priceListHost.addPriceList({
        href: null,
        product: this.href.value,
        type: 'default',
        platforms: [],
        locations: [],
        isProgressive: false,
        ranges: [
          { href: null, priceList: null, price: null, minQuantity: 1, maxQuantity: null },
        ]
      });
    }

    for (const media of entity?.media ?? []) {
      this.mediaHost.add(media);
    }

    if (entity?.subscription) {
      this.subscriptionHost.add(entity?.subscription);
    }
  }

  /**
   * Overridden implementation: This form hosts several sub-views, which must
   * be saved separate of the main product:  Because of that, the data
   * must be deleted from the data we pass to the product service.
   */
  getFormValue(): any {
    const formValue = {};
    delete (this.form.value.marketplaceAttributes);
    Object.assign(formValue, this.form.value);

    // delete sub entities that shouldn't be saved on the primary object
    // like price-lists, media, dll.
    delete (formValue as products.IProduct).media;
    delete (formValue as products.IProduct).priceLists;
    return formValue;
  }

  save() {

    const formPatch = {
      attributes: this.formValueMapping,
    };
    // we should patch here after know that the marketplace is different, otherwise the data will be gone
    this.patchAttribute(formPatch)

    this.service.save(this.getFormValue()).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(resp => {
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp);
        } else {
          if (this.isProductOptionDomain) this.subscriptionHost.save(resp.entity).subscribe(() => { });

          this.mediaHost.saveAll(resp.entity).subscribe(() => { });
          this.priceListHost.saveAll(resp.entity).pipe(catchError(child_err => {
            if (child_err instanceof HttpErrorResponse) {
              return of(new ErrorResult<IError>(child_err.error, child_err.status));
            } else {
              return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, child_err.status));
            }
          })).subscribe( (child_resp) => {
              if (child_resp instanceof ErrorResult) {
                this.onSaveError(child_resp);
              } else {
                this.onSaveSuccess(resp);
              }
            }
          );
        }
      }
    );
    this.form.disable();
  }

  addVariant() {
    this.router.navigate(['./variants/new'], {relativeTo: this.route});
  }


  addTag(value?: string) {
    this.tags.push(
      this.fb.control(value, [Validators.required, ])
    );
  }

  addRelatedProduct() {
    throw Error('Not Implemented');
  }

  navigateToParent(warnOnDirty: boolean = false) {
    if (this.structure.value === 'parent') {
      super.navigateToParent(warnOnDirty);
    } else {
      this.router.navigate([`/catalog/products/${getSlugFromHref(this.parentProduct.href)}`]);
    }
  }

  /**
   * Disables irrelevant/invalid product values for certain classes of product.
   */
  onProductClassChanged(newValue: any) {
    // protect against triggering during initialization
    if (!newValue || !this.productClasses) { return; }
    const pc = this.productClasses.filter(e => e.href === newValue)[0];
    const slugs = pc.href.split('/').reverse();
    this.productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.hideOnChangeProductClass = true;

    this.productClassName = pc.name;

    if (pc.type === 'physical') {
      this.weight.enable();
    } else {
      this.weight.disable();
    }
  }

  scrollTo(id: string) {
    const elmnt = document.getElementById(id);
    elmnt.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    this.currentActive = id;
  }

  goToAttribute(): void {
    this.router.navigate(['/catalog/product-classes', this.productClassSlug]);
  }

  showMarketplaceDetail() {
    this.marketplaceInfo.open()
  }

  showShippingDetail() {
    this.shippingModalComponent.open();
  }

  show(){
    this.visible=true;
  }

  toggleShowDiv(index: number) {
      this.showDivIndex = index;
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  getAttributeOfMarketplace(marketplace: any) {
    this.showNoSlider = false;
    this.hideOnChangeProductClass = false;
    if(this.currentMarketpalce){
      if(this.currentMarketpalce !== marketplace.toLowerCase()){
        const formPatch = {
          attributes: this.formValueMapping,
        };
          //we should patch here after know that the marketplace is different, otherwise the data will be gone
        this.patchAttribute(formPatch)
      }
    }

    this.currentMarketpalce = marketplace.toLowerCase();
    this.clearFormArray(this.marketplaceAttributes);

    this.itemService
      .getItemMarketplaceAttribute(this.currentMarketpalce,this.productClassSlug.toLowerCase(), this.productSlug)
      .subscribe((data: IMarketplaceItemAttributeInformation[]) => {
        this.isBusy = true;
        this.marketplaceStoreAttributes = data;
        this.isDropDown = false;
        this.isInput = false;
        this.isComboBox = false;

        if(data === null){
          this.showNoSlider = true;
        }

        //loop add form for edit attribute
        data?.forEach((objStore:IMarketplaceItemAttributeInformation,index) => {
          objStore.attributes.forEach((objAttr) => {
            this.marketplaceAttributes.push(
              this.fb.group({
                name: [objAttr.name],
                type: [objAttr.type],
                identifier: [objAttr.identifier],
                value: [objAttr.value],
                option: [objAttr.option],
                newvalue: null,
                indexShop: index,
              })
            );
          });
        })
    });
  }

  get formValueMapping() {
    //this part is to validate new value at combo box
    return this.marketplaceAttributes.value.map((attr: any) => {
      let currVal = attr.value;
      if(attr.newvalue!==null){
        currVal = attr.newvalue;
      }
      return {
        identifier: attr.identifier,
        value: currVal,
        product: this.productSlug,
      };
    });
  }

  attrChange(value: string, index: number) {
    const attr = this.marketplaceAttributes.at(index).get('newvalue');
    if (value === 'addNewAttr') {
      attr.setValidators(Validators.required);

      //should set string otherwise it will give value addNewAttr
      attr.setValue("")
    } else {
      attr.clearValidators();
      attr.reset();
    }
    attr.updateValueAndValidity();
  }

  patchAttribute(formPatch: any){
    this.itemService
      .patchItemAttribute(formPatch, this.productClassSlug.toLowerCase())
      .subscribe(
        (resp) => {
          console.log(resp);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  onChangeProductClass(event: any) {
    const slugs = event.target.value.split('/').reverse();

    // get last slug
    this.productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.hideOnChangeProductClass = true;
    this.clearFormArray(this.marketplaceAttributes);
  }

  updateValidator(newForm: any) {
    if(!newForm){
        this.form.controls['marketplaceAttributes'].setValidators([Validators.required,]);
        this.form.controls['marketplaceAttributes'].updateValueAndValidity();
    }
  }
}
