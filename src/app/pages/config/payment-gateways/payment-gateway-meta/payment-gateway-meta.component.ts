import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'nus-payment-gateway-meta',
  template: `
    <tr [formGroup]="form">
      <th>{{ index + 1 }}</th>
      <td><input type="text" [formControl]="item" placeholder="xxx"/></td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [':host { display: contents; }']
})
export class PaymentGatewayMetaComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() index: number;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  get item(): FormControl { return this.form.get('item') as FormControl; }

  constructor() {
  }

  ngOnInit(): void {

  }

}
