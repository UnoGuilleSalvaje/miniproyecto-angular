import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ReporteComponent } from './reporte/reporte.component';
import { EstanciasComponent } from './estancias/estancias.component';
import { BlogComponent } from './blog/blog.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';
import { UnaEstanciaComponent } from './una-estancia/una-estancia.component';
import { FormularioComponent } from './formulario/formulario.component';
import { FelicitarComponent } from '../app/inicio/felicitar/felicitar.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MostrarComponent } from './mostrar/mostrar.component';
import { MisReservacionesComponent } from './mis-reservaciones/mis-reservaciones.component';
import { AyudaComponent } from './ayuda/ayuda.component';

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
    ({path: 'login', component: LoginComponent}),
    {path: 'main', component: InicioComponent},
    {path: 'mostrar', component: MostrarComponent},
    {path: 'misreservaciones', component: MisReservacionesComponent},
    {path: 'ayuda', component: AyudaComponent},
    {path: '**', redirectTo: 'inicio'}
];
