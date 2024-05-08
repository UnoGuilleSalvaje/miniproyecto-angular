import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.obtenerCitas();
  }

  obtenerCitas(): void {
    const reservas = this.obtenerReservasDesdeLocalStorage();
    const fechaActual = new Date();

    this.citasAnteriores = reservas.filter(reserva => new Date(reserva.fechaHora) < fechaActual);
    this.citasFuturas = reservas.filter(reserva => new Date(reserva.fechaHora) >= fechaActual);
  }

  obtenerReservasDesdeLocalStorage(): any[] {
    const reservas: any[] = [];
    const keys = Object.keys(localStorage);

    for (const key of keys) {
      if (key.startsWith('reserva_')) {
        const reserva = JSON.parse(localStorage.getItem(key) || '{}');
        reservas.push(reserva);
      }
    }

    return reservas;
  }
}
