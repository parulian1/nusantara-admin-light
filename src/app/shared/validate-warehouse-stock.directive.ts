import { Directive, Input } from '@angular/core';
import { ValidatorFn, FormGroup, FormArray, ValidationErrors, NG_VALIDATORS, Validator, AbstractControl, FormControl } from '@angular/forms';

export function warehouseStockValidator(form: FormGroup): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const originstocks = form.get('originStock').value ;
    const isManagedKgx = form.get('isManagedKgx').value ;

    if (!isManagedKgx && control.value > originstocks ) {
      return  {invalidStock:true}
    }

    return null;
  };
}
