import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { MaestroHoraComponent } from './maestro-hora/maestroHora.component';
import { MaestroTurnoComponent } from './maestro-turno/maestroTurno.component';
import { ProgramarTurnoComponent } from './programar-turno/programar-turno.component';
import { RegistrarHorasComponent } from './registro-horas/registro-horas.component';


export const routes: Routes = [
    { path: 'registrarHoras', component: RegistrarHorasComponent },
    { path: 'programarTurno', component: ProgramarTurnoComponent },
    { path: 'maestroTurno', component: MaestroTurnoComponent },
    { path: 'maestroHora', component: MaestroHoraComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
