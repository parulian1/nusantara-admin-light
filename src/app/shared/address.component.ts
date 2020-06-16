import { Input, Component } from '@angular/core';

import { AddressAutocompleteService } from '@nusantara/services';
import { FormControl, FormGroup } from '@angular/forms';

/**
 * A component for rendering an address selector
 * within other forms.
 */
@Component({
  selector: 'nus-address',
  template: `
    <label>
      <span>Street</span>
      <input formControlName="street">
    </label>

    <label>
      <span>Province</span>
      <input formControlName="province">
    </label>

    <label>
      <span>City</span>
      <input formControlName="city">
    </label>

    <label>
      <span>District</span>
      <input formControlName="district">
    </label>

    <label>
      <span>Sub-District</span>
      <input formControlName="subDistrict">
    </label>

    <label>
      <span>Postal Code</span>
      <input formControlName="postalCode">
    </label>

    <label *ngIf="showCountry">
      <span>Country</span>
      <select formControlName="country">
        <option *ngFor="let c of countries" [ngValue]="c.value">
          {{c.displayName}}
        </option>
      </select>
    </label>
  `,
  styles: [

  ]
})
export class AddressComponent {

  @Input() showCountry = false;
  @Input() form: FormGroup;
  @Input() showDiscreteDistrictData = false;

  isBusy: false;

  get postalCode(): FormControl { return this.form.get('postalCode') as FormControl; }
  get country(): FormControl { return this.form.get('country') as FormControl; }

  // only supporting indonesia, so we're going to hardcode this.
  countries: Array<{displayName: string, value: string}> = [
    {displayName: 'Indonesia', value: 'id'},
  ];

  constructor(public service: AddressAutocompleteService) { }

}
