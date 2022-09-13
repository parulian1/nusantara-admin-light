import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {DialogResult} from '@nusantara/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'nus-promotion-single-type-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'promoTypeSelection'" #modal [customClass]="'wide-modal'">
      <h2 class="heading-2" i18n>Add Promotion</h2>
      <p class="body-2" i18n>Select the type of promotion</p>

      <div class="accordion-wrapper">
        <div class="accordion">
          <div class="accordion__title" [ngClass]="{'show': openAccordion == 'pricePromo'}" (click)="toggleAccordion('pricePromo')">
            <span class="subheading-2">Price Promo</span>
            <i class="material-icons">expand_more</i>
          </div>
          <div class="accordion__content" [ngClass]="{'show': openAccordion == 'pricePromo'}">
            <label class="radio" role="radio">
              <input type="radio" value="amount_off" [formControl]="type">
              <div>
                <p class="subheading-2" i18n>Cut by Amount</p>
                <p class="caption-1" i18n>Reduce product price by a certain price for a period of time</p>
              </div>
            </label>
            <label class="radio" role="radio">
              <input type="radio" value="percentage" [formControl]="type">
              <div>
                <p class="subheading-2" i18n>Cut by Percentage</p>
                <p class="caption-1" i18n>Reduce product price by a number of percentage for a period of time</p>
              </div>
            </label>
            <label class="radio" role="radio">
              <input type="radio" value="override_price" [formControl]="type">
              <div>
                <p class="subheading-2" i18n>Flush Price</p>
                <p class="caption-1" i18n>Reduce or update product price into a desired price for a period of time</p>
              </div>
            </label>
          </div>
        </div>

        <div class="accordion">
          <div class="accordion__title" [ngClass]="{'show': openAccordion == 'bundlePromo'}" (click)="toggleAccordion('bundlePromo')">
            <span class="subheading-2">Bundle Promo</span>
            <i class="material-icons">expand_more</i>
          </div>
          <div class="accordion__content" [ngClass]="{'show': openAccordion == 'bundlePromo'}">
            <label class="radio" role="radio">
              <input type="radio" value="promo_bundling" [formControl]="type">
              <div>
                <p class="subheading-2" i18n>Buy X Get Y</p>
                <p class="caption-1" i18n>Set a specific promotion gift(s) for a purchase of a specific product(s)</p>
              </div>
            </label>
          </div>
        </div>

        <div class="accordion">
          <div class="accordion__title" [ngClass]="{'show': openAccordion == 'minPurchasePromo'}" (click)="toggleAccordion('minPurchasePromo')">
            <span class="subheading-2">Minimum Purchase Promo</span>
            <i class="material-icons">expand_more</i>
          </div>
          <div class="accordion__content" [ngClass]="{'show': openAccordion == 'minPurchasePromo'}">
            <label class="radio" role="radio">
              <input type="radio" value="free_gift" [formControl]="type">
              <div>
                <p class="subheading-2" i18n>Promotion gift</p>
                <p class="caption-1" i18n>With a minimum purchase, customer can choose a promotion gift. <br>
                  e.g.: lucky dip promo, pohon angpao promo</p>
              </div>
            </label>
          </div>
        </div>

        <div class="accordion">
          <div class="accordion__title" [ngClass]="{'show': openAccordion == 'loyaltyPointPromo'}" (click)="toggleAccordion('loyaltyPointPromo')">
            <span class="subheading-2">Loyalty Point Promo</span>
            <i class="material-icons">expand_more</i>
          </div>
          <div class="accordion__content" [ngClass]="{'show': openAccordion == 'loyaltyPointPromo'}">
            <label class="radio" role="radio">
              <input type="radio" value="multiply_point" [formControl]="type">
              <div>
                <p class="subheading-2" i18n>Multiply loyalty point</p>
                <p class="caption-1" i18n>Multiply loyalty point for each transaction for a period of time</p>
              </div>
            </label>
          </div>
        </div>

      </div>

      <div class="action">
        <button class="control" [disabled]="!form.valid" (click)="goTo()" i18n>Add</button>
        <button class="control secondary ghost" (click)="cancel()" type="button" i18n>Cancel</button>
      </div>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { margin-bottom: 11px; }',
    'p { color: var(--darken-grey); }',
    '.wrapper { padding: 16px; }',
    '.message { margin: 0 8px 32px 8px; }',
    'div.action { display: flex; justify-content: space-between; }',
    'button { width: 100% }',
    'button:not(:first-of-type) { margin-left: 5px; }',
    '.caption-1 { margin: 6px 0; }',
    `
      .accordion-wrapper {
        margin-bottom: 32px;
      }

      .accordion__title {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 11px 12px;
        justify-content: space-between;
        border: 1px solid var(--grey);
        cursor: pointer;
        transition: transform 0.2s ease-out;
      }

      .accordion__title:hover {
        background: var(--secondary);
        color: var(--white);
        transition: transform 0.2s ease-out;
      }

      .accordion__title > i {
        transition: transform 0.2s ease-out;
      }

      .accordion__title.show > i {
        transform: rotate(180deg);
      }

      .accordion__content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 12px;
        gap: 12px;
        height: 0;
        max-height: fit-content;
      }

      .accordion__content.show {
        height: 100%;
        padding: 12px;
        border: 1px solid var(--grey);
      }

      .accordion__content > label {
        display: none;
        padding-bottom: 0;
        min-height: fit-content;
      }

      .accordion__content.show > label {
        display: flex;
      }
    `
  ]
})
export class PromotionSingleTypeSelectionModalComponent implements OnInit {
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;

  openAccordion = 'pricePromo';

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      type: ['', [Validators.required]],
    });
  }

  open() {
    this.modal.open();
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    this.result = DialogResult.Cancelled;
    this.modal.close();
  }

  toggleAccordion(tab: string) {
    this.openAccordion = this.openAccordion === tab ? ''  : tab;
  }

  goTo() {
    const promoType = this.type.value;
    const page = 'promotion/promo/single/new/'+promoType;
    this.router.navigate([page]);
  }
}
