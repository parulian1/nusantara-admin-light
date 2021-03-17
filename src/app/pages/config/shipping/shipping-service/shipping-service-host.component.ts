import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { drf } from '@nusantara/models';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nus-shipping-service-host',
  template: `
    <tr [formGroup]="form">
      <td>
        <select formControlName="name" data-qa="name" [formControl]="name"
                (change)="updateSelectedService()">
          <option [ngValue]="null">---</option>
          <option *ngFor="let type of shippingServiceTypes" [ngValue]="type.value"
                  [disabled]="isSelectedService(type.displayName)">
            {{ type.displayName }}
          </option>
        </select>
      </td>
      <td *ngIf="!isShipingKgx()"><input type="checkbox" [formControl]="isActive"></td>
      <td *ngIf="!isShipingKgx()"><input type="number" [formControl]="minimumWeight"></td>
      <td *ngIf="!isShipingKgx()"><input type="number" [formControl]="handlingFee"></td>
      <td *ngIf="!isShipingKgx()"><input type="number" [formControl]="graceAmount"></td>
      <td *ngIf="!isShipingKgx()">
        <input type="text" [formControl]="description" data-qa="description" placeholder="lorem ipsum ..">
      </td>
      <td>
        <button (click)="removeService()" type="button" class="remove-button" data-qa="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>`,
  styles: [
    ':host { display: contents; }',
    'td > select { width: 100%; }'
  ]
})

export class ShippingServiceHostComponent implements OnInit, AfterViewInit {
  @Input() shippingServiceTypes: drf.IChoice[];
  @Input() form: FormGroup;
  @Input() shippingType: string;
  @Output() remove = new EventEmitter<void>();
  @Input() selectedService: any;
  @Output() newSelectedService = new EventEmitter<string>();
  @Output() removeSelectedService = new EventEmitter<string>();

  constructor(public route: ActivatedRoute,
              public router: Router) {
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get icon(): FormControl {
    return this.form.get('icon') as FormControl;
  }

  get minimumWeight(): FormControl {
    return this.form.get('minimumWeight') as FormControl;
  }

  get handlingFee(): FormControl {
    return this.form.get('handlingFee') as FormControl;
  }

  get graceAmount(): FormControl {
    return this.form.get('graceAmount') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  isShipingKgx() {
    return this.shippingType === 'kgx';
  }

  isSelectedService(serviceName: any) {
    return this.selectedService.includes(serviceName);
  }

  updateSelectedService() {
    const serviceName = this.form.get('name').value;
    this.newSelectedService.emit(serviceName);
  }

  removeService() {
    const serviceName = this.form.get('name').value;
    this.remove.emit();
    if (serviceName) {
      this.removeSelectedService.emit(serviceName);
    }
  }

}
