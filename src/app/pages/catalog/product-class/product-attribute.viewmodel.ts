import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IProductAttribute } from '@nusantara/models';


export class ProductAttributeViewModel {
  form: FormGroup;

  constructor(private fb: FormBuilder, attr?: IProductAttribute) {
    this.fb.group({
      name: [attr?.name, {readonly: !!attr?.href}, [Validators.required, ]],
      href: [attr?.href, ],
      type: [attr?.type, ],
      productClasses: [attr?.productClasses],
      minValue: [attr?.minValue, ],
      maxValue: [attr?.maxValue, ]
    });
  }
}
