import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { MaestroHoraComponent } from './maestro-hora/maestroHora.component';
import { MaestroTurnoComponent } from './maestro-turno/maestroTurno.component';


export const routes: Routes = [
    { path: 'maestroTurno', component: MaestroTurnoComponent },
    { path: 'maestroHora', component: MaestroHoraComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
