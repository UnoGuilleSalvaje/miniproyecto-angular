import { Component } from '@angular/core';
import { UnaEstanciaComponent } from '../una-estancia/una-estancia.component';
import { Estancia } from '../estancia';
import { EstanciasService } from '../services/estancias.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [UnaEstanciaComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  nombree:string = "";
  indice:number = 0;

  miEstancia:Estancia={
    nombre: "",
    propietario: "",
    email: "",
    telefono: "",
    precio: 0,
    direccion: "",
    imagen: "",
    id: 0
  };

  constructor(private estanciasService:EstanciasService, private activatedRoute:ActivatedRoute) { 
    this.activatedRoute.params.subscribe(params => {
      this.nombree = params['nombree'];

      console.log("Nombre a buscar en SearchComponent:" + this.nombree);

      this.indice = this.estanciasService.searchUnaEstancia(this.nombree);
      console.log(this.indice);

      if (this.indice != -1) {
          this.miEstancia = this.estanciasService.getUnaEstancia(this.indice);
      }
  });
  }
}
