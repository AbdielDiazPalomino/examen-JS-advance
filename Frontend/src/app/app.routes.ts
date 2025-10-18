import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AdministracionComponent } from './components/administracion/administracion';
import { BoletaComponent } from './components/boleta/boleta';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'boleta', component: BoletaComponent },
];
