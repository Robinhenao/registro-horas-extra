import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AxiosService } from '../axios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-horas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-horas.component.html',
  styleUrls: ['./registro-horas.component.css'] // Asegúrate de corregir el nombre de la propiedad aquí
})

export class RegistrarHorasComponent implements OnInit {
  registroHorasForm!: FormGroup;

  constructor(private fb: FormBuilder, private axiosService: AxiosService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registroHorasForm = this.fb.group({
      diaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      ticketNombre: ['', [Validators.required, Validators.maxLength(100)]],
      observacion: ['', Validators.maxLength(500)]
    });
  }

  async submitForm() {
    if (this.registroHorasForm.invalid) {
      this.registroHorasForm.markAllAsTouched();
      return;
    }

    // Convertimos los valores del formulario al formato esperado por el backend
    const formData = this.registroHorasForm.value;

    const requestData = {
      DiaInicio: this.formatDate(formData.diaInicio), // Convertimos la fecha
      HoraInicio: this.formatTime(formData.horaInicio), // Convertimos la hora
      HoraFin: this.formatTime(formData.horaFin), // Convertimos la hora
      TicketNombre: formData.ticketNombre,
      Observacion: formData.observacion || null // Enviamos `null` si el campo está vacío
    };

    try {
      await this.axiosService.post('/RegistroHoras', requestData);

      Swal.fire({
        title: 'Registro Exitoso',
        text: 'La hora ha sido registrada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      this.registroHorasForm.reset();
    } catch (error: any) {
      console.error('Error al registrar la hora:', error);
      const errorMessage =
        error.response?.data?.message || 'Ocurrió un error al registrar la hora. Por favor, intente nuevamente.';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  // Método para formatear las fechas (DateOnly)
  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Meses comienzan en 0
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Método para formatear las horas (TimeOnly)
  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`; // Añadimos segundos por consistencia
  }
}
