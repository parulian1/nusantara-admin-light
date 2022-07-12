import { Input, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { INamedHrefEntity } from '@nusantara/models/base';
import { AddressAutocompleteService } from './address-autocomplete.service';
import { ICityPostalInfo } from './city-postal-info';
import { IAddress } from './address';
import { InternalAddressValue } from './internal-address-value';

/**
 * A component for rendering an address selector
 * within other forms.
 *
 * Please pay attention!  This form is a little bit unique.. even though
 * you must bind a form group to this component, there is an inner form here
 * which is adapted to the outer address format.
 *
 * @example
 *  <nus-address [form]="myAddressFormGroup"></nus-address>
 */
@Component({
  selector: 'nus-address',
  template: `
    <div [formGroup]="innerForm">
      <label>
        <span i18n>Street</span>
        <input [formControl]="street" name="street" maxlength="250">
        <nus-field-errors [control]="form.get('street')"></nus-field-errors>
      </label>

      <label>
        <span i18n>Province</span>
        <select [formControl]="province" name="province">
          <option *ngFor="let prov of availableProvinces" [ngValue]="prov">
            {{ prov.name }}
          </option>
        </select>
        <nus-field-errors [control]="form.get('province')"></nus-field-errors>
      </label>

      <label>
        <span i18n>City</span>
        <select [formControl]="city" name="city">
          <option *ngFor="let city of availableCities" [ngValue]="city">
            {{ city.name }}
          </option>
        </select>
        <nus-field-errors [control]="form.get('city')"></nus-field-errors>
      </label>

      <label>
        <span i18n>Postal Code</span>
        <select [formControl]="postal" name="postal">
          <option *ngFor="let postalInfo of availablePostals" [ngValue]="postalInfo">
            {{ postalInfo.district }} / {{ postalInfo.subDistrict }} ({{ postalInfo.postalCode }})
          </option>
        </select>
        <nus-field-errors [control]="form.get('postalCode')"></nus-field-errors>
      </label>
    </div>
  `,

})
export class AddressComponent implements OnInit {

  private isInitializing = true;

  @Input() form: FormGroup;

  innerForm: FormGroup;

  availableProvinces: INamedHrefEntity[] = [];
  availableCities: INamedHrefEntity[] = [];
  availablePostals: ICityPostalInfo[] = [];

  constructor(public service: AddressAutocompleteService, public fb: FormBuilder) { }

  get street(): FormControl { return this.innerForm.get('street') as FormControl; }
  get province(): FormControl { return this.innerForm.get('province') as FormControl; }
  get city(): FormControl { return this.innerForm.get('city') as FormControl; }
  get postal(): FormControl { return this.innerForm.get('postal') as FormControl; }

  ngOnInit(): void {
    // setup initial form state
    this.innerForm = this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(255) ]],
      province: [null, [Validators.required, ]],
      city: [{value: null, disabled: true}, [Validators.required, ]],
      postal: [{value: null, disabled: true}, [Validators.required, ]],
    });

    // initialize province choices, then initialize inner address data (if outer address data set)
    this.service
      .fetchProvinces('id')
      .subscribe(data => {
        // populate all available province
        this.availableProvinces = data;

        // initialize our inner form, with data from the outer form
        this.adaptToInner(this.form.value as IAddress);
      });

    // wire up event handlers
    this.province.valueChanges.subscribe((newProvince) => {
      if (!this.isInitializing) {
        this.onProvinceChanged(newProvince);
      }
    });
    this.city.valueChanges.subscribe((newCity) => {
      if (!this.isInitializing) {
        this.onCityChanged(newCity);
      }
    });
    this.innerForm.valueChanges.subscribe((address) => {
      if (!this.isInitializing) {
        this.adaptToOuter(address);
      }
    });
  }

  private onProvinceChanged(newValue: INamedHrefEntity) {

    // always clear cities and postals
    this.availableCities.length = 0;
    this.city.setValue(null);
    this.city.disable();

    this.availablePostals.length = 0;
    this.postal.setValue(null);
    this.postal.disable();

    if (!!newValue) {

      // populate cities
      this.service
        .fetchCities((this.province.value as INamedHrefEntity).href)
        .subscribe(data => {
          this.availableCities = data;
          this.city.enable();
        });
    }
  }
  private onCityChanged(newValue: INamedHrefEntity) {

    this.availablePostals.length = 0;
    this.postal.setValue(null);
    this.postal.disable();

    if (!!newValue) {
      this.service
        .fetchPostalData((this.city.value as INamedHrefEntity).href)
        .subscribe(data => {
          this.availablePostals = data;
          this.postal.enable();
        });
    }
  }

  /**
   * Takes whatever value is currently set and converts it to the data format
   * for this component.
   *
   * This is a very brutally-ugly callback-laden method.
   *
   * @param outerValue The value of the external FormGroup that is bound to this component.
   */
  private adaptToInner(outerValue: IAddress) {

    this.street.setValue(outerValue.street);

    // source value doesn't have a province; stop initialization.
    if (!outerValue.province) {
      this.isInitializing = false;
      return;
    }

    // Step 1/3 -- initialize province
    this.province.setValue(this.getProvinceFromName(outerValue.province));

    // failed to match the province to our form data; stop initialization
    if (!this.province.value) {
      this.isInitializing = false;
      return;
    }

    // step 2/3 -- initialize city
    this.service
      .fetchCities((this.province.value as INamedHrefEntity).href)
      .subscribe(cityList => {
        this.city.enable();
        this.availableCities = cityList;
        this.city.setValue(this.getCityFromName(outerValue.city));

        // failed to match the city to our form data; stop initialization
        if (!this.city.value) {
          this.isInitializing = false;
          return;
        }

        // step 3/3 -- initialize postal
        this.service
          .fetchPostalData((this.city.value as INamedHrefEntity).href)
          .subscribe(postalList => {
            this.postal.enable();
            this.availablePostals = postalList;
            this.postal.setValue(
              this.getPostalInfo(outerValue.district, outerValue.subDistrict, outerValue.postalCode)
            );

            // regardless if we matched a postal or not, initialization is now complete
            this.isInitializing = false;
          });
      });
  }

  private getProvinceFromName(provinceName: string): INamedHrefEntity {
    const matches = this.availableProvinces.filter(prov => prov.name === provinceName);
    if (!!matches.length) {
      return matches[0];
    }
    return null;
  }
  private getCityFromName(cityName: string): INamedHrefEntity {
    const matches = this.availableCities.filter(city => city.name === cityName);
    if (!!matches.length) {
      return matches[0];
    }
    return null;
  }
  private getPostalInfo(district: string, subDistrict: string, postalCode: string): ICityPostalInfo {
    const matches = this.availablePostals.filter(
      p => p.district === district && p.subDistrict === subDistrict && p.postalCode === postalCode
    );
    if (!!matches.length) {
      return matches[0];
    }
    return null;
  }

  private adaptToOuter(innerValue: InternalAddressValue) {
    this.form.setValue({
      street: innerValue.street,
      city: innerValue.city?.name ?? null,
      district: innerValue.postal?.district ?? null,
      subDistrict: innerValue.postal?.subDistrict ?? null,
      postalCode: innerValue.postal?.postalCode ?? null,
      province: innerValue.province?.name ?? null,
      country: 'id', // this is always indonesia, for our purposes.
      notes: '',
      latitude: null,
      longitude: null,
    });
  }

}

