import { Component} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from './validation.service';
import Swal from 'sweetalert2';

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
      Swal.fire({
        title: 'Inicio de sesión exitoso',
        text: 'Has iniciado sesión correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      console.log('Formulario enviado', this.loginForm.value);
      
    } else {
      Swal.fire({
        title: 'Error',
        text: 'El formulario no es válido, por favor revisa los campos.',
        icon: 'error',
        confirmButtonText: 'Reintentar'
      });
    }
  }
}
