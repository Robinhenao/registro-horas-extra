import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-turno',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tipoTurno.component.html',
  styleUrl: './tipoTurno.component.css'
})
export class TipoTurnoComponent implements OnInit {
  registroForm!: FormGroup;
  modoEdicion = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      horaInicio: ['', [
        Validators.required,
        Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')
      ]],
      horaFin: ['', [
        Validators.required,
        Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')
      ]],
      multiplicador: ['', [Validators.required, Validators.min(0)]]
    }, { validators: this.validarHoras });
  }

  validarHoras(group: FormGroup) {
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

    this.registroForm.get(controlName)?.setValue(value);
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      //va conxion back

      Swal.fire({
        title: 'Registro tipo de turno.',
        text: 'Has registrdo correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      console.log(this.registroForm.value);
      this.registroForm.reset();
    } else {
      this.marcarCamposComoTocados();
    }
  }

  private marcarCamposComoTocados(): void {
    Object.values(this.registroForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get nombre() { return this.registroForm.get('nombre'); }
  get horaInicio() { return this.registroForm.get('horaInicio'); }
  get horaFin() { return this.registroForm.get('horaFin'); }
  get multiplicador() { return this.registroForm.get('multiplicador'); }
}