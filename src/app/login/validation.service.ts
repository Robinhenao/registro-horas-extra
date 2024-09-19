import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  getValidators(field: string): ValidatorFn[] {
    switch (field) {
      case 'username':
        return [Validators.required, Validators.minLength(4)];
      case 'password':
        return [Validators.required, Validators.minLength(6)];
      default:
        return [];
    }
  }

  getErrorMessage(field: string, errors: any): string {
    const fieldLabel = field === 'password' ? 'contraseña' : field === 'username' ? 'usuario' : field;

    if (errors['required']) {
      return `El campo ${fieldLabel} es obligatorio.`;
    }
    return '';
  }

}