import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Estancia } from '../estancia';
import { EstanciasService } from '../services/estancias.service';

@Component({
  selector: 'app-una-estancia',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './una-estancia.component.html',
  styleUrl: './una-estancia.component.css'
})
export class UnaEstanciaComponent {
  @Input()estancia!:Estancia;
  constructor(public estanciasService:EstanciasService, public activatedRoute: ActivatedRoute) {
      this.activatedRoute.params.subscribe(params => {
        this.estancia = estanciasService.getUnaEstancia(params['id']);
      });
  }
}
