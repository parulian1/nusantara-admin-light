import {FormGroup, Validators} from '@angular/forms';


/** Chunk proses to sets validator fields to specific type of payment gateway */
export const setAndClearValidators = (value, form: FormGroup, logo = null) => {
  if (value === 'manual_transfer') {
    form.get('accountHoldNumber').setValidators([Validators.required]);
    form.get('accountNumber').setValidators([Validators.required]);

    if (logo && logo === '/assets/no-image_id.png') {
      form.get('logo').setValidators([Validators.required]);
    }
  } else {
    form.get('accountHoldNumber').clearValidators();
    form.get('accountNumber').clearValidators();
    form.get('logo').clearValidators();
  }

  form.get('accountHoldNumber').updateValueAndValidity();
  form.get('accountNumber').updateValueAndValidity();
  form.get('logo').updateValueAndValidity();
};
