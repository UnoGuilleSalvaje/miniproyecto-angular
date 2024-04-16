import { Component } from '@angular/core';
import { Estancias } from '../interfaces/estancias';
import { EstanciasService } from '../services/estancias.service';

@Component({
  selector: 'app-estancias',
  standalone: true,
  imports: [],
  templateUrl: './estancias.component.html',
  styleUrl: './estancias.component.css'
})
export class EstanciasComponent {
  array:Estancias [] = [];

  constructor(public estanciasService: EstanciasService) {}

  ngOnInit() {
    console.log("En este instante el componente ha cargado");
    this.recuperarDatos();
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
