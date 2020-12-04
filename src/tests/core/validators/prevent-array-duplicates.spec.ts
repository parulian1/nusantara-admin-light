import { FormArray, FormControl } from '@angular/forms';

import { NusantaraValidators } from '@nusantara/core';

describe('NusantaraValidators.preventArrayDuplicates', () => {

  let formArray: FormArray;

  beforeEach(() => {
    formArray = new FormArray([], [NusantaraValidators.preventArrayDuplicates(), ]);
  });

  it('allows empty arrays', () => {
    expect(formArray.valid).toBeTrue();
  });

  it('returns validation errors for duplicates', () => {
    formArray.push(new FormControl('a', []));
    formArray.push(new FormControl('b', []));
    formArray.push(new FormControl('a', []));

    expect(formArray.valid).toBeFalse();
    expect(formArray.getError('duplicates')).toEqual({value: ['a', ]});
  });

  it('returns null for arrays without duplicates', () => {
    formArray.push(new FormControl('a', []));
    formArray.push(new FormControl('b', []));

    expect(formArray.valid).toBeTrue();
  });
});
