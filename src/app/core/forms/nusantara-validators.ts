/** A hero's name can't match the given regular expression */
import {FormArray, ValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import {convertDateTime} from "@nusantara/shared/helpers";

/**
 * Checks a FormArray and ensures there are no duplicate elements within
 * the array.  This can **only** be used with arrays containing
 * primitive types, such as strings or numbers.
 */
export function preventArrayDuplicates(): ValidatorFn {
  return (control: FormArray): ValidationErrors | null => {
    const counts: {string: number} = (control.value as Array<any>).reduce(
      (obj, b) => { obj[b] = ++obj[b] || 1; return obj; }, {}
    );
    const duplicates = Object
      .entries(counts)
      .filter((r) => r[1] > 1)
      .map((r) => r[0]);
    return duplicates.length > 0 ? {duplicates: {value: duplicates}} : null;
  };
}

export function minDateTime(minDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if( typeof minDate !== 'undefined' && minDate !== '' ) {
      // foo could get resolved and it's defined
      return convertDateTime(minDate) > convertDateTime(control.value) ? {minDateTime: {value: control.value}} : null;
    } else {
      console.log(minDate);
      return null
    }
  };
}

export function maxDateTime(maxDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if( typeof maxDate !== 'undefined' && maxDate !== '' ) {
      // foo could get resolved and it's defined
      return convertDateTime(maxDate) < convertDateTime(control.value) ? {maxDateTime: {value: control.value}} : null;
    } else {
      console.log(maxDate);
      return null
    }
  };
}
