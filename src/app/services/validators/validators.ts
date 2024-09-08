import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function urlValidator(): ValidatorFn {
  const pattern = /^(https?:\/\/)(www\.)?[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9#\-]*)?\/?$/;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const isValid = pattern.test(control.value);
    return isValid ? null : { invalidUrl: true };
  };
}
