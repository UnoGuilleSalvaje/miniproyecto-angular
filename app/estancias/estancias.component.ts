import { Component } from '@angular/core';
import { Estancias } from '../interfaces/estancias';
import { EstanciasService } from '../services/estancias.service';
import { Estancia } from '../estancia';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estancias',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './estancias.component.html',
  styleUrl: './estancias.component.css'
})
export class EstanciasComponent {
  array:Estancias [] = [];

  miEstancia: Estancia[] = [];

  constructor(public estanciasService: EstanciasService, public miservicio: EstanciasService) {}

  ngOnInit() {
    console.log("En este instante el componente ha cargado");
    this.recuperarDatos();
    this.miEstancia = this.miservicio.getEstancias();
  }

  recuperarDatos(): void {
    console.log("Entré");

    this.estanciasService.retornar().subscribe({
      next: this.successRequest.bind(this),
      error: (err) => {console.log(err)}
    });
  }

  successRequest(data:any):void {
    console.log("data", data);
    this.array = data.estancias;
    console.log("array", this.array);
  }
}
