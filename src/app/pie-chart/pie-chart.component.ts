import { Component, OnInit } from '@angular/core';
// Necesitamos importar Chart desde chart.js/auto
import Chart, { ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  // Atributo que almacena los datos del chart
  public chart: Chart;

  ngOnInit(): void {

    // datos
    const data = {
      labels: [
        'Muebles',
        'Limpieza',
        'Electronicos'
      ],
      datasets: [{
        label: 'Mayores productos vendidos',
        data: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    // Creamos la gráfica
    this.chart = new Chart("chart", {
      type: 'pie' as ChartType, // tipo de la gráfica 
      data // datos 
    })

  }

}
