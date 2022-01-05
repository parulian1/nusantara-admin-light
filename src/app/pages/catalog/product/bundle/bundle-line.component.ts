import { AfterViewInit, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'nus-bundle-line',
  template: `
  <tr [formGroup]="form">
    <td style="word-break: break-word">
      <a target="_blank"
         [routerLink]="['/catalog/products', href?.value | entityToSlug]">
        {{ name.value }}
      </a>
    </td>
    <td style="word-break: break-word">{{ upc.value }}</td>
    <td>{{ weight.value }} kilogram</td>
    <td>
      <input type="number" [formControl]="quantity" (ngModelChange)="update.emit()"
             [min]="1" (keypress)="onlyNumberNonDecimal($event)">
      <div *ngIf="quantity.value > 999999" class="error-detail">
        <div i18n>Max. quantity 999999 </div>
      </div>
    </td>
    <td>{{ price.value | currency: 'Rp ': 'symbol' : '1.0'}}</td>
    <td>
      <button (click)="remove.emit()" type="button" class="remove-button">
        <i class="material-icons">remove_circle_outline</i>
      </button>
    </td>
  </tr>
  `,
  styles: [
    ':host { display: contents; }',
  ]
})
export class BundleLineComponent implements OnInit {
  @Output() remove = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();
  form: FormGroup;
  productForm: FormGroup;

  constructor(private controlContainer: ControlContainer) {
  }

  get href(): FormControl { return this.productForm.get('href') as FormControl; }
  get name(): FormControl { return this.form.get('name')  as FormControl; }
  get upc(): FormControl { return this.form.get('upc') as FormControl; }
  get weight(): FormControl { return this.form.get('weight') as FormControl; }
  get quantity(): FormControl { return this.form.get('quantity') as FormControl; }
  get price(): FormControl { return this.form.get('price') as FormControl; }

  ngOnInit() {
    this.form = (this.controlContainer.control as FormGroup);
    this.productForm = this.form.get('product') as FormGroup;
  }

  onlyNumberNonDecimal($event: any) {
    return $event.charCode >= 48 && $event.charCode <= 57;
  }
}
