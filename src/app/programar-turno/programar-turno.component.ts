import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../axios.service';
import Swal from 'sweetalert2';

interface ShiftSchedule {
  id: number;
  engineer: string;
  startDate: string;
  endDate: string;
  shift: string;
}

interface TurnType {
  Id: number;
  Nombre: string;
  HoraInicio: string;
  HoraFin: string;
}

interface User {
  Id: number;
  Name: string;
  Email: string;
  Password: string;
  IsActive: boolean;
}

interface UserTurno {
  FechaInicio: Date;
  FechaFin: Date;
  UserId: number;
  MaestroTurnoId: number;
}

@Component({
  selector: 'app-programar-turno',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './programar-turno.component.html',
  styleUrl: './programar-turno.component.css'
})
export class ProgramarTurnoComponent implements OnInit {
  schedules: ShiftSchedule[] = [];
  userTurnos: UserTurno[] = [];

  turnTypes: {
    id: number;
    nombre: string;
  }[] = [];

  users: {
    id: number;
    name: string;
  }[] = [];

  filteredEngineers: { id: number, name: string }[] = [];
  searchQuery: string = '';
  
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedEngineerId: number | null = null;
  selectedTurnTypeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private axiosService: AxiosService
  ) { }

  ngOnInit() {
    this.loadTurnTypes();
    this.loadEngineers();
  }

  async loadTurnTypes() {
    try {
      const response = await this.axiosService.get('/maestroturno');
      this.turnTypes = response.data.map((turn: TurnType) => ({
        id: turn.Id,
        nombre: turn.Nombre,
        horaInicio: turn.HoraInicio,
        horaFin: turn.HoraFin
      }));
    } catch (error) {
      console.error('Error loading turn types:', error);
    }
  }

  async loadEngineers() {
    try {
      const response = await this.axiosService.get('/users');
      this.users = response.data.map((user: User) => ({
        id: user.Id,
        name: user.Name
      }));
    } catch (error) {
      console.error('Error loading engineers:', error);
    }
  }

  filterEngineers() {
    if (this.users.length === 0) {
      return;
    }
    
    this.filteredEngineers = this.users.filter(engineer =>
      engineer.name && engineer.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectEngineer(engineer: any) {
    this.searchQuery = engineer.name;
    this.selectedEngineerId = engineer.id;
    this.filteredEngineers = [];
  }

  addShift() {
    if (!this.selectedEngineerId || !this.selectedTurnTypeId || 
        !this.selectedStartDate || !this.selectedEndDate) {
      alert('Por favor complete todos los campos');
      return;
    }
    const engineer = this.users.find(u => u.id === this.selectedEngineerId);
    const turnType = this.turnTypes.find(t => t.id === Number(this.selectedTurnTypeId));
    this.schedules.push({
      id: this.schedules.length + 1,
      engineer: engineer?.name || '',
      startDate: this.formatDate(this.selectedStartDate),
      endDate: this.formatDate(this.selectedEndDate),
      shift: turnType?.nombre || ''
    });
    this.userTurnos.push({
      FechaInicio: new Date(this.selectedStartDate),
      FechaFin: new Date(this.selectedEndDate),
      UserId: this.selectedEngineerId,
      MaestroTurnoId: this.selectedTurnTypeId
    });

    this.clearFields();
  }

  clearFields() {
    this.searchQuery = '';
    this.selectedEngineerId = null;
    this.selectedTurnTypeId = null;
    this.selectedStartDate = '';
    this.selectedEndDate = '';
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    return `${day}-${month}`;
  }

  async saveShifts() {
    try {
      if (this.userTurnos.length === 0) {
        alert('No hay turnos para guardar');
        return;
      }
      const response = await this.axiosService.post('/userturno', this.userTurnos);
      Swal.fire({
        title: 'Registro programcion.',
        text: 'Has registrdo correctamente la programacion de turno.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
        this.userTurnos = [];
        this.schedules = [];
    } catch (error: any) {
      Swal.fire({
        title: 'Error registro',
        text: 'Ha ocurrido un error al registrar la programacion de turno. Por favor, intenta de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

 
  private validateShifts(): boolean {
    if (this.userTurnos.length === 0) {
      return false;
    }
    return this.userTurnos.every(turno => 
      turno.UserId && 
      turno.MaestroTurnoId && 
      turno.FechaInicio && 
      turno.FechaFin
    );
  }
}