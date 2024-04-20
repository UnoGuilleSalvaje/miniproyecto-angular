import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { ReporteComponent } from './reporte/reporte.component';
import { EstanciasComponent } from './estancias/estancias.component';
import { BlogComponent } from './blog/blog.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';
import { UnaEstanciaComponent } from './una-estancia/una-estancia.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'reporte', component: ReporteComponent},
    {path: 'estancias', component: EstanciasComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'about', component: AboutComponent},
    {path: 'search', component: SearchComponent},
    {path: 'estancia/:id', component: UnaEstanciaComponent},
    {path: 'buscador/:nombree', component: SearchComponent},
    {path: '**', redirectTo: 'inicio'}
];
