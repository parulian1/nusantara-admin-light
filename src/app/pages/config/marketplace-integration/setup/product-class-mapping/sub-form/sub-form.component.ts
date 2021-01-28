import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  ValidationErrors,
  Validator,
} from '@angular/forms';

export abstract class SubFormComponent implements ControlValueAccessor, Validator {
  form: FormGroup;

  public onTouched(): void {}

  public writeValue(value: any): void {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
      this.onTouched();
    }
  }

  public registerOnChange(fn: (x: any) => void): void {
    this.form.valueChanges.subscribe(fn);
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { subformerror: 'Problems in subform!' };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.form.statusChanges.subscribe(fn);
  }
}
