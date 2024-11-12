import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../axios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mestro-hora',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './maestroHora.component.html',
  styleUrl: './maestroHora.component.css'
})
export class MaestroHoraComponent implements OnInit {
  maestroHoraForm!: FormGroup;
  modoEdicion = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private axiosService: AxiosService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.maestroHoraForm = this.fb.group({
      nombre: ['', [Validators.required]],
      horaInicio: ['', [
        Validators.required,
        Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')
      ]],
      horaFin: ['', [
        Validators.required,
        Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')
      ]],
      multiplicador: ['', [
        Validators.required,
        Validators.min(0)]]
    }, { validators: (group: FormGroup) => this.validarHoras(group) });
  }

  validarHoras = (group: FormGroup) => {
    const horaInicio = group.get('horaInicio')?.value;
    const horaFin = group.get('horaFin')?.value;

    if (horaInicio && horaFin) {
      const inicio = this.convertirAMinutos(horaInicio);
      const fin = this.convertirAMinutos(horaFin);

      if (fin <= inicio) {
        return { horaFinInvalida: true };
      }
    }
    return null;
  }

  private convertirAMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  formatearHora(event: any, controlName: string): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 4) {
      value = value.substr(0, 4);
    }

    if (value.length >= 3) {
      const horas = value.substr(0, 2);
      const minutos = value.substr(2);

      if (parseInt(horas) > 23) {
        value = '23' + minutos;
      }
      if (parseInt(minutos) > 59) {
        value = horas + '59';
      }

      value = `${horas}:${minutos}`;
    }

    this.maestroHoraForm.get(controlName)?.setValue(value);
  }

  private formatearHoraConSegundos(hora: string): string {
    return `${hora}:00`; // Añadir ":00" para los segundos
  }

  async onSubmit(): Promise<void> {
    if (this.maestroHoraForm.valid) {
      console.log(this.maestroHoraForm.value);
      try {
        const formData = {
          ...this.maestroHoraForm.value,
          horaInicio: this.formatearHoraConSegundos(this.maestroHoraForm.value.horaInicio),
          horaFin: this.formatearHoraConSegundos(this.maestroHoraForm.value.horaFin),
        };

        const response = await this.axiosService.post('/maestrohora', formData);
        console.log(response.data);
        Swal.fire({
          title: 'Registro maestro hora.',
          text: 'Has registrdo correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.mensajeExito = 'Usuario registrado con éxito.';
        this.maestroHoraForm.reset();
      } catch (error) {
        this.marcarCamposComoTocados();
        Swal.fire({
          title: 'Error registro maestro hora',
          text: 'Ha ocurrido un error al registrar maestro hora. Por favor, intenta de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.mensajeError = 'Error al registrar maestro hora. Por favor, intenta de nuevo.';
        this.mensajeExito = '';

      }
    } else {
      this.marcarCamposComoTocados();
      this.mensajeError = 'Error al registrar maestro hora. Por favor, intenta de nuevo.';
      this.mensajeExito = '';
    }
  }

  private marcarCamposComoTocados(): void {
    Object.values(this.maestroHoraForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get nombre() { return this.maestroHoraForm.get('nombre'); }
  get horaInicio() { return this.maestroHoraForm.get('horaInicio'); }
  get horaFin() { return this.maestroHoraForm.get('horaFin'); }
  get multiplicador() { return this.maestroHoraForm.get('multiplicador'); }
}