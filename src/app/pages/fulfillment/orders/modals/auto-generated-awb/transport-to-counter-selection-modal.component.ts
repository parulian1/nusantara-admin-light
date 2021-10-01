import { AfterViewInit, Component, EventEmitter, Input, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, _closeDialogVia} from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { OrderService } from "@nusantara/services";
import { ToastLevelEnum, ToastService } from '@nusantara/core';

@Component({
  selector: 'nus-transport-to-counter-selection-modal',
  template: `
    <nus-spinner [appBusy]="isBusy"></nus-spinner>
    <div class="wrapper">
        <div class="message">
          <h2 class="title-2" i18n>Ship Order</h2>
          <p i18n><strong>{{orderData.sourceName | titlecase }} | {{orderData.storeName}} | {{shippingMethod ? shippingMethod : "-" }} </strong></p>
          <div class="shipping-method">
            <div class="method-option" *ngIf="this.type.indexOf('dropoff') > -1">
              <span><input type="radio" name="logistic" value="dropoff" (click)="showPickupForm($event)"></span>
              <img src="/assets/deliver-to-counter.svg">
              <span>
                <div class="subheading-2" i18n>
                  Deliver to Counter
                </div>
                <div class="body-2" i18n>
                  Deliver your packages to the closest <strong>{{shippingMethod}}</strong> counter.
                </div>
              </span>
            </div>
            <div class="method-option" *ngIf="this.type.indexOf('pickup') > -1">
              <span><input type="radio" name="logistic" value="pickup" (click)="showPickupForm($event)"/></span>
              <img src="/assets/use-pickup-service.svg">
              <span>
                <div class="subheading-2" i18n>
                  Use Pick Up Service
                </div>
                <div class="body-2" i18n>
                  <strong>{{shippingMethod ? shippingMethod : "-" }}</strong> will pick up the packages from your address.
                </div>
              </span>
            </div>
            <form [formGroup]="form" (ngSubmit)="logisticInit()" *ngIf="showPickUpForm">
                <h2 class="title-2">Set Pick Up Service</h2>
                <div class="subheading-2">
                    Store Address
                </div>

                <div class="method-option" *ngFor="let addr_ of this.addresses;">
                  <span>
                    <input  type="radio" (click)="showDateTimeForm(addr_.id)"
                            formControlName="addressId" name="addressId" [value]="addr_.id"/>
                  </span>
                  <span>
                    <div class="body-2">
                      <p>{{addr_.address}}</p>
                    </div>
                  </span>
                </div>

                <div>
                  <div class="subheading-2">
                      Date and Time
                  </div>
                  <select formControlName="pickupId">
                    <option value="">Select Date and Time</option>
                    <option
                      *ngFor="let opt of DateTime?.timeSlot;" [ngValue]="opt.pickupTimeId">{{ opt.date }}
                    </option>
                  </select>
                </div>
            </form>
          </div>
        </div>
        <button [disabled]="!form.valid" type="submit" class="control" (click)="logisticInit()" i18n>Submit</button>
      </div>
  `,
  styles: [
    '.wrapper { padding: 16px }',
    '.message { margin: 8px 8px 20px 8px; }',
    'h2 { padding-bottom: 24px }',
    'p { color : var(--darken-grey-color); margin: 0; }',
    '.shipping-method { margin-top: 28px; }',
    `.method-option {
      border: solid 1px var(--grey);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px; }`,
    '.method-option:not(:last-child) { margin-bottom: 16px; }',
    'button { width: 50% }'
  ]
})
export class TransportToCounterSelectionModalComponent implements OnInit {
  public logisticObject;
  type : any;
  showPickUpForm: boolean;
  form: FormGroup;
  addresses : any;
  DateTimeForm: boolean;
  DateTime: any;
  orderData: any;
  selectedType : string;
  href: string;
  shippingMethod: string;
  isBusy: boolean;

  constructor(
    protected fb: FormBuilder,
    public service: OrderService,
    public toast: ToastService,
    public dialogRef: MatDialogRef<TransportToCounterSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.type = this.data.logistic.type;
    this.addresses = this.data.logistic.address;
    this.orderData = this.data.orderDetail;
    this.href = this.orderData.children[0].data[0].href;
    this.shippingMethod = this.orderData.children[0].data[0].shippingMethod;
    this.initializeForm();
  }

  get pickupId(): FormControl { return this.form?.get('pickupId') as FormControl; }
  get addressId(): FormControl { return this.form?.get('addressId') as FormControl; }

  private initializeForm(): void {
    this.form = this.fb.group({
      pickupId: ['', Validators.required],
      addressId: ['', Validators.required],
      status: 'shipped',
      href: this.href,
    });
  }

  showPickupForm(event){
    this.selectedType = event.target.value;
    if(this.selectedType == "pickup"){
      this.initializeForm();
      this.showPickUpForm = true;
      this.pickupId.setValue('');
    } else {
      this.showPickUpForm = false;
      this.form.get('pickupId').clearValidators();
      this.form.get('addressId').clearValidators();
      this.form.reset();
    }
  }

  showDateTimeForm(value){
    this.pickupId.setValue('')
    this.DateTime = this.addresses.filter( x => x.id === value)[0]
  }

  getFormValue(): any {

    if(this.selectedType == 'pickup'){
      const formValue = {
        pickup_id : this.form.value.pickupId,
        address_id : this.form.value.addressId,
        href: this.href,
        status: "shipped",
        logistic_type: this.selectedType
      };
      return formValue;

    } else {
      const formValue = {
        href: this.href,
        pickup_id : "none",
        address_id : 0,
        status: "shipped",
        logistic_type: this.selectedType
      };
      return formValue;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logisticInit(){
    this.service.updateByOrderNumber(this.orderData.orderNumber, this.getFormValue()).subscribe(() => {
        this.isBusy = true;
        setTimeout(function(){
            window.location.reload();
        }, 3000);
    }, error => {
      this.toast?.addMessage(
          'Unable to cancel order. Please try again.',
          'Failed to Cancel Order',
          ToastLevelEnum.error
        );
        console.log(error)
    });
  }

}
