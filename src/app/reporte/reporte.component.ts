import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../services/places.service';
import Place from '../interfaces/place.interface';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit {
  citasAnteriores: any[] = [];
  citasFuturas: any[] = [];


  constructor(private placesService: PlacesService) { }

  ngOnInit(): void {
    //Firestore
    this.placesService.getPlaces().subscribe((places: Place[]) => {
      console.log("Reporte Firebase: ", places);
      this.citasAnteriores = []; // Reiniciar el arreglo
      this.citasFuturas = []; // Reiniciar el arreglo
      this.categorizeCitas(places);
    });
  }
  

  categorizeCitas(places: Place[]) {
    const now = new Date().getTime();

    places.forEach(place => {
      // Verificar que fechaHora no sea undefined
      if (place.fechaHora) {
        const citaTime = new Date(place.fechaHora).getTime();

        if (citaTime < now) {
          this.citasAnteriores.push(place);
        } else {
          this.citasFuturas.push(place);
        }
      } else {
        console.warn(`La cita con nombre ${place.nombre} no tiene una fecha y hora válida.`);
      }
    });
  }

  async borrarCita(place: Place) {
    const response = await this.placesService.deletePlace(place);
    console.log(response);
  }
}
