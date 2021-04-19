import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IOrderPaymentConfirm,
  IPaymentGateway,
  order,
} from '@nusantara/models';
import { OrderPaymentConfirmService } from '@nusantara/services';
import { HttpErrorResponse } from '@angular/common/http';

interface IPaymentConfirmDialog {
  action: 'create' | 'update';
  data?: order.IOrderPaymentConfirm;
}

@Component({
  selector: 'nus-order-payment-confirm-dialog',
  template: `
    <ngx-smart-modal #myModal identifier="myModal" [escapable]="false">
      <h1>
        {{
          isUpdate() ? "Update Payment Confirm" : "Create new Payment Confirm"
        }}
      </h1>

      <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>
      <form [formGroup]="form" (ngSubmit)="save()">
        <label>
          <span>Sender Name</span>
          <input type="text" [formControl]="shippingName" name="name" />

          <div *ngIf="shippingName.invalid && (shippingName.touched || shippingName.dirty)" class="error-detail">
            <div *ngIf="shippingName.hasError('required')">Required</div>
            <div *ngIf="shippingName.hasError('apiError')">{{ shippingName.errors['apiError'][0] }}</div>
          </div>
        </label>

        <label>
          <span>Transfer Amount</span>
          <input type="number" [formControl]="transferAmount" name="name" />

          <div *ngIf="transferAmount.invalid && (transferAmount.touched || transferAmount.dirty)" class="error-detail">
            <div *ngIf="transferAmount.hasError('required')">Required</div>
            <div *ngIf="transferAmount.hasError('apiError')">{{ transferAmount.errors['apiError'][0] }}</div>
          </div>
        </label>

        <label>
          <span>Transfer To</span>
          <select
            class="select-wrapper"
            [class.is-error]="transferTo.invalid && (transferTo.touched || transferTo.dirty)"
            [formControl]="transferTo">
            <option
              *ngFor="let paymentGateway of paymentGateways"
              [value]="paymentGateway.href"
            >
              {{ paymentGateway.name }} - {{ paymentGateway.accountHoldNumber}} - {{ paymentGateway.accountNumber }}
            </option>
          </select>

          <div *ngIf="transferTo.invalid && (transferTo.touched || transferTo.dirty)" class="error-detail">
            <div *ngIf="transferTo.hasError('required')">Required</div>
            <div *ngIf="transferTo.hasError('apiError')">{{ transferTo.errors.apiError }}</div>
          </div>
        </label>

        <label>
          <span>Proof Image</span>
          <img
            *ngIf="proofImageHelpers?.url || proofImageHelpers?.base64"
            [src]="proofImageHelpers?.url || proofImageHelpers?.base64"
            style="width: 80%; height: 150px;"
            alt="Proof Image"
            class="preview"
          />
          <input
            type="file"
            [class.is-error]="proofImage.invalid && (proofImage.touched || proofImage.dirty)"
            [formControl]="proofImage"
            (change)="changeProofImage($event)"
            name="proof-image"
            accept="image/*"
          />
          <div *ngIf="proofImage.invalid && (proofImage.touched || proofImage.dirty)" class="error-detail">
            <div *ngIf="proofImage.hasError('required')">Required</div>
            <div *ngIf="proofImage.hasError('apiError')">{{ transferTo.errors.apiError }}</div>
          </div>
        </label>

        <button type="submit" class="control">
          {{ isUpdate() ? "Update" : "Create" }}
        </button>
      </form>
    </ngx-smart-modal>
  `,
  styles: [`
    .is-error {
      border: 1px solid #af3b6e;
    }

    .select-wrapper {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
    }
  `],
})
export class OrderPaymentConfirmDialogComponent implements OnChanges, OnInit {
  @ViewChild('myModal') myModal: any;
  @Input() paymentConfirm: order.IOrderPaymentConfirm;
  @Input() paymentGateways: IPaymentGateway[];
  @Input() order: order.IOrderDetail;
  @Output()
  action: EventEmitter<IPaymentConfirmDialog> = new EventEmitter<IPaymentConfirmDialog>();

  nonFieldErrors: Array<any> = [];

  form: FormGroup;
  proofImageHelpers: {
    base64: string;
    nameImage: string;
    url: string;
  } = { base64: null, nameImage: null, url: null };

  constructor(
    private fb: FormBuilder,
    private service: OrderPaymentConfirmService,
  ) {}

  ngOnInit(): void {
    this.service.baseUrl = `/api/order/order/${this.order.orderNumber}/payment-confirm`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentConfirm) {
      this.resetProofImage();
      this.initialForm(this.paymentConfirm);
    }
  }

  initialForm(entity?: order.IOrderPaymentConfirm) {
    this.form = this.fb.group({
      href: [entity?.href ?? null],
      shippingName: [entity?.shippingName ?? null, [Validators.required]],
      transferAmount: [entity?.transferAmount ?? null, [Validators.required]],
      transferTo: [entity?.transferTo ?? null, [Validators.required]],
      proofImage: ['', [Validators.required]],
    });

    this.handleProofImageUpdate(entity?.proofImage);
  }

  get shippingName(): FormControl {
    return this.form.get('shippingName') as FormControl;
  }
  get transferAmount(): FormControl {
    return this.form.get('transferAmount') as FormControl;
  }
  get transferTo(): FormControl {
    return this.form.get('transferTo') as FormControl;
  }
  get proofImage(): FormControl {
    return this.form.get('proofImage') as FormControl;
  }

  getFormValue(): any {
    const data = {
      ...this.form.value,
      proofImage: this.proofImageHelpers.base64,
      // transferTo: 'http://localhost:8000/payment-gateway/awesome/',
    };

    if (!this.proofImageHelpers.base64) {
      delete data.proofImage;
    }
    return data;
  }

  save(): void {
    if (this.form.valid) {
      const formValue = this.getFormValue();
      if (this.isUpdate()) {
        this.service.update(formValue).subscribe(
          () => this.handleSuccess(),
          (error) => this.handleError(error)
        );
      } else {
        delete formValue.href;
        this.service.create(formValue).subscribe(
          () => this.handleSuccess(),
          (error) => this.handleError(error)
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  changeProofImage(e): void {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.proofImageHelpers.base64 = reader.result as string;
      this.proofImageHelpers.url = null;
      this.proofImageHelpers.nameImage = file.name;
    };
  }

  handleProofImageUpdate(imageUrl?: string) {
    if (imageUrl) {
      this.proofImage.clearValidators();
      this.proofImageHelpers = { base64: null, nameImage: null, url: imageUrl };
    }
  }

  resetProofImage(): void {
    this.proofImageHelpers = { base64: null, url: null, nameImage: null };
  }

  isUpdate(): boolean {
    return !!this.paymentConfirm;
  }

  handleSuccess(): void {
    alert(`success ${this.isUpdate() ? 'update' : 'create'} payment confirm`);

    this.action.emit({
      action: this.isUpdate() ? 'update' : 'create',
      data: this.getFormValue() as IOrderPaymentConfirm,
    });

    this.resetProofImage();
    this.myModal.close();
  }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.error.status === 400) {
        Object.values(error.error).forEach((field: any) => {
          if (this.form.controls[field]) {
            this.form.controls[field].setErrors({ apiError: error.error[field][0] });
          }
        });

        if (error.error?.nonFieldErrors) {
          this.nonFieldErrors = [...this.nonFieldErrors, ...error.error.nonFieldErrors];
        }
      } else {
        this.nonFieldErrors.push(error.error.detail);
      }
    }
  }
}
