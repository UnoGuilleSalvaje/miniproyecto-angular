import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Registro } from '../interfaces/registro';
import { RegistroService } from '../services/registro.service';
import { Estancias } from '../interfaces/estancias';
import { EstanciasService } from '../services/estancias.service';
import { Estancia } from '../estancia';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit {
  
    registroForm: FormGroup;
    array:Estancias [] = [];
    miEstancia: Estancia[] = [];
  miservicio: any;
    

    constructor(private fb: FormBuilder, private registroService: RegistroService, private estanciasService: EstanciasService) {
        this.registroForm = this.fb.group({
            fechaHora: ['', [Validators.required, this.validateDateTimeNotOccupied.bind(this)]],
            nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
            telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            correo: ['', [Validators.required, Validators.email]],
            precio: ['', [Validators.required, Validators.min(0)]],
            direccion: ['', Validators.required],
            imagen: ['', Validators.required],
            dias: ['', [Validators.required, Validators.min(1)]]
        });
    }
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

    recuperarEstancias(): void {
      this.estanciasService.retornar().subscribe({
            next: (data: any) => {
              // Verifica el tipo y estructura de data
              console.log('Datos recibidos de estanciasService:', data);
              
              // Asigna a estanciasArray dependiendo de la estructura de data
              if (data && Array.isArray(data)) {
                this.array = data;
              } else if (data && data.estancias && Array.isArray(data.estancias)) {
                this.array = data.estancias;
              } else {
                console.warn('Estructura de datos inesperada:', data);
                this.array = [];
              }
            },
          error: (err) => {
              console.error('Error al recuperar estancias:', err);
              this.array = [];
          }
      });
  }

    // Validación personalizada para verificar si la fecha y hora ya está ocupada
    private validateDateTimeNotOccupied(control: { value: any; }) {
        const fechaHora = control.value;
        if (this.registroService.isDateTimeOccupied(fechaHora)) {
            return { dateTimeOccupied: true };
        }
        return null;
    }

    // Guardar un nuevo registro
    guardarRegistro(): void {
        if (this.registroForm.valid) {
            const nuevoRegistro: Registro = this.registroForm.value;
            this.registroService.addRegistro(nuevoRegistro);
            this.registroForm.reset();
        }
    }
    reservarEstancia(estancia: Estancias): void {
      console.log("Reservando estancia:", estancia);
      // Aquí puedes agregar el código necesario para reservar la estancia
  }
}
