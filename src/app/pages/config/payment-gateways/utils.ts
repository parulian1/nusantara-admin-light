import {FormGroup, Validators} from '@angular/forms';


/** Chunk proses to sets validator fields to specific type of payment gateway */
export const setAndClearValidators = (value, form: FormGroup, logo = null) => {
  const _logo = form.get('logo');
  if (value === 'manual_transfer') {
    form.get('accountHoldNumber').setValidators([Validators.required]);
    form.get('accountNumber').setValidators([Validators.required]);

    if (logo && logo === 'assets/no-image_id.png') {
      if (_logo) {
        form.get('logo').setValidators([Validators.required]);
      }
    }
  } else {
    form.get('accountHoldNumber').clearValidators();
    form.get('accountNumber').clearValidators();
    if (_logo) {
      form.get('logo').clearValidators();
    }
  }

  form.get('accountHoldNumber').updateValueAndValidity();
  form.get('accountNumber').updateValueAndValidity();
  if (_logo) {
    form.get('logo').updateValueAndValidity();
  }
};
