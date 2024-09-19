import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from './validation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent{
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', this.validationService.getValidators('username')],
      password: ['', this.validationService.getValidators('password')]
    });
  
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control && control.errors && (control.dirty || control.touched)) {
      return this.validationService.getErrorMessage(field, control.errors);
    }
    return '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario enviado', this.loginForm.value);
      // Aquí iría la lógica para enviar los datos al servidor
    }
  }
}
