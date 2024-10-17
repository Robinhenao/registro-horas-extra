import { Component} from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from './validation.service';
import { AxiosService } from '../axios.service';
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
    private validationService: ValidationService,
    private axiosService: AxiosService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', this.validationService.getValidators('email')],
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

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const response = await this.axiosService.post('/auth/login', this.loginForm.value);
        console.log('Respuesta del servidor:', response.data);
        
        // Aquí puedes manejar la respuesta del servidor
        // Por ejemplo, guardar el token de autenticación
      
        if (response.data.Token) {
          localStorage.setItem('token', response.data.Token);
        }

        Swal.fire({
          title: 'Inicio de sesión exitoso',
          text: 'Has iniciado sesión correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // Aquí puedes redirigir al usuario a la página principal o dashboard
        // Por ejemplo: this.router.navigate(['/dashboard']);

      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        
        Swal.fire({
          title: 'Error en el inicio de sesión',
          text: 'No se pudo iniciar sesión. Por favor, verifica tus credenciales e intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Reintentar'
        });
      }
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
