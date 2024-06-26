import { Routes } from '@angular/router';
import { RegisterComponent } from './src/app/register/register.component';
import { InicioComponent } from './app/inicio/inicio.component';
import { FormularioComponent } from './app/formulario/formulario.component';
import { ReporteComponent } from './app/reporte/reporte.component';
import { EstanciasComponent } from './app/estancias/estancias.component';
import { BlogComponent } from './app/blog/blog.component';
import { AboutComponent } from './app/about/about.component';
import { SearchComponent } from './app/search/search.component';
import { UnaEstanciaComponent } from './app/una-estancia/una-estancia.component';
import { FelicitarComponent } from './app/inicio/felicitar/felicitar.component';
import { LoginComponent } from './src/app/login/login.component';
import { MainComponent } from './src/app/main/main.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MostrarComponent } from './src/app/mostrar/mostrar.component';

import { MisReservacionesComponent } from './src/app/mis-reservaciones/mis-reservaciones.component';
import { AyudaComponent } from './src/app/ayuda/ayuda.component';
import { AccessibilityButtonComponent } from './src/app/accesibilitybutton/accesibilitybutton.component';
import { AdminComponent } from './src/app/admin/admin.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'formulario', component: FormularioComponent, ...canActivate(()=> redirectUnauthorizedTo(['login']))},
    {path: 'reporte', component: ReporteComponent, ...canActivate(()=> redirectUnauthorizedTo(['login']))},
    {path: 'estancias', component: EstanciasComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'about', component: AboutComponent},
    {path: 'search', component: SearchComponent},
    {path: 'estancia/:id', component: UnaEstanciaComponent},
    {path: 'buscador/:nombree', component: SearchComponent},
    {path: 'felicitar', component: FelicitarComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'main', component: MainComponent},
    {path: 'mostrar', component: MostrarComponent},

    {path: 'misreservaciones', component: MisReservacionesComponent},
    {path: 'ayuda', component: AyudaComponent},

    {path: 'accesibilidad', component: AccessibilityButtonComponent},
    {path: 'admin', component: AdminComponent},

    {path: '**', redirectTo: 'inicio'}
];
