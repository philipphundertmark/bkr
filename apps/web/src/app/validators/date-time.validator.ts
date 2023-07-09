import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Allow empty string or null
    if (value === '' || value === null) {
      return null;
    }

    // Check for the format "DD.MM.YYYY HH:mm:ss"
    const regex =
      /^([0-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.\d{4}\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (!regex.test(value)) {
      return { dateTimeFormat: true };
    }

    return null;
  };
}
