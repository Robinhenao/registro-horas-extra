import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AxiosService } from '../axios.service';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder, 
    private axiosService: AxiosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordFortalezaValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordFortalezaValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
    return !passwordValid ? { 'passwordDebil': true } : null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  async onSubmit(): Promise<void> {
    if (this.registroForm.valid) {
      try {
        // Eliminamos confirmPassword antes de enviar los datos
        const { confirmPassword, ...userData } = this.registroForm.value;

        const response = await this.axiosService.post('/users', userData);
        console.log('Respuesta del servidor:', response.data);

        Swal.fire({
          title: 'Registro de usuario exitoso',
          text: 'Te has registrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        this.registroForm.reset();
        this.mensajeError = '';
        this.mensajeExito = 'Usuario registrado con éxito.';

        // Aquí podrías redirigir al usuario a la página de login o al dashboard
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al registrar usuario:', error);

        Swal.fire({
          title: 'Error en el registro',
          text: 'Ha ocurrido un error al intentar registrarte. Por favor, intenta de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });

        this.mensajeError = 'Error al registrar usuario. Por favor, intenta de nuevo.';
        this.mensajeExito = '';
      }
    } else {
      this.mensajeError = 'Por favor, corrige los errores en el formulario.';
      this.mensajeExito = '';
    }
  }

}