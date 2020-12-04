/** A hero's name can't match the given regular expression */
import { FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';

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
