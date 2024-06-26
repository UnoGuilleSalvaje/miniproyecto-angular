import { signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

// Atributo que almacena los datos del chart
public chart: Chart;

ngOnInit(): void {
  // datos

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    datasets: [{
      label: 'Reserveaciones Por Mes',
      data: [Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };
  
  // Creamos la gráfica
  this.chart = new Chart("chart", {
    type: 'bar' as ChartType, // tipo de la gráfica 
    data // datos 
  })

}




}
