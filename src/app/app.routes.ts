import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { TipoTurnoComponent } from './tipoTurno/tipoTurno.component';


export const routes: Routes = [
    { path: 'tipoTurno', component: TipoTurnoComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
