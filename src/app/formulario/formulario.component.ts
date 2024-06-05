import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Estancia } from '../estancia';
import { EstanciasService } from '../services/estancias.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Estancias } from '../interfaces/estancias';
import Swal from 'sweetalert2'
import { PlacesService } from '../services/places.service';

@Component({
    selector: 'app-formulario',
    standalone: true,
    imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, RouterModule, CommonModule],
    templateUrl: './formulario.component.html',
    styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

    formularioForm: FormGroup;
    estancia: any;  // Los datos de la estancia
    // guardar currentdate para validar que no se esocga una fecha ya pasada
    currentDate = new Date();

    // Constructor ------------------------------------------------------------------------------------------------------>
    constructor(private placesService: PlacesService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, public estanciasService: EstanciasService, public miservicio: EstanciasService) {
        // Inicializa el formulario con los campos y las validaciones requeridas
        // Aquí, se está creando un formulario reactivo utilizando el FormBuilder de Angular. Los campos del formulario se definen en el FormGroup y se les aplican las validaciones correspondientes.
        this.formularioForm = this.fb.group({
            id: [''],
            fechaHora: ['', [Validators.required, this.validateDateTimeNotOccupied]],
            nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
            telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            dias: ['', [Validators.required, Validators.min(1)]],
            correo: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        // Obtener los datos pasados en la ruta
        const navigation = this.router.getCurrentNavigation();
        if (navigation && navigation.extras.state) {
            this.estancia = navigation.extras.state['estancia'];

            // Rellenar el formulario con los datos de la estancia
            this.formularioForm.patchValue({
                precio: this.estancia.precio,
                direccion: this.estancia.direccion,
                correo: this.estancia.correo,
                nombre: this.estancia.nombre,
                id: this.estancia.id
            });
        }

        this.recuperarDatos();
        this.miEstancia = this.miservicio.getEstancias();
    }

    // Función de validación personalizada para verificar la fecha y hora
    validateDateTimeNotOccupied(control: { value: any; }) {
      const fechaHora = control.value;
  
      if (fechaHora) {
          const fechaHoraSeleccionada = new Date(fechaHora);
          const currentDate = new Date();
          const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  
          // Verificar si la fecha seleccionada es anterior a la fecha actual
          if (fechaHoraSeleccionada < currentDate) {
              setTimeout(() => {
                Swal.fire('Error', 'La fecha y hora seleccionadas ya pasaron.', 'error');
              }, 2000);
              return { pastDate: true }; // Fecha pasada
          }

          
  
          // Verificar si la estancia y fecha ya están ocupadas
          for (const reserva of reservas) {
              const fechaHoraReservaGuardada = new Date(reserva.fechaHora);
              const estanciaReservaGuardada = reserva.estancia;
  
              // Comprobar si la fecha y estancia coinciden con una reserva existente
              if (this.estanciaSeleccionada && this.estanciaSeleccionada.nombre === estanciaReservaGuardada.nombre) {
                  const fechaReservaExistente = new Date(fechaHoraReservaGuardada.getFullYear(), fechaHoraReservaGuardada.getMonth(), fechaHoraReservaGuardada.getDate());
                  const fechaReservaSeleccionada = new Date(fechaHoraSeleccionada.getFullYear(), fechaHoraSeleccionada.getMonth(), fechaHoraSeleccionada.getDate());
  
                  // Verificar si la fecha de la reserva existente coincide con la fecha de la selección
                  if (fechaReservaExistente.getTime() === fechaReservaSeleccionada.getTime()) {
                    setTimeout(() => {
                      Swal.fire('Error', 'La estancia ya ha sido reservada para esa fecha.', 'error');
                    }, 2000);
                      return { occupied: true }; // Fecha ocupada para la misma estancia
                  }
              }
          }
      } 
      return null;
  }
  
  

    // Guardar la reservación ------------------------------------------------------------------------------------------------------>
    async guardarReservacion() {
      const reservaKey = 'reserva_' + Date.now(); // Aquí utilizo la marca de tiempo actual como parte de la clave

      if (this.formularioForm.valid && this.estanciaSeleccionada) {
          const reserva = {
              ...this.formularioForm.value,
              id: reservaKey, // Agregar la clave única como el ID de la reserva
              estancia: this.estanciaSeleccionada // Agregar la estancia seleccionada a los datos de la reserva
          };
  
          // Almacenar en Local Storage utilizando la clave única
          //localStorage.setItem(reservaKey, JSON.stringify(reserva));
  
          //Firebase
          console.log(reserva); // Asegúrate de que `reserva` incluye todos los datos necesarios
          const response = await this.placesService.addPlace(reserva); // Enviar la reserva completa, incluyendo `estancia`
          console.log(response); // Comprobar si se guardó o no
  
          // Mostrar mensaje de éxito con SweetAlert
          Swal.fire('¡Éxito!', 'Reservación guardada con éxito.', 'success');
  
          // Aquí puedes agregar cualquier lógica adicional, como redirigir a otra página
      } else {
          // Mostrar mensaje de error con SweetAlert
          Swal.fire('Error', 'El formulario no es válido o no se ha seleccionado una estancia.', 'error');
      }
  }
  

  array:Estancias [] = [];

  miEstancia: Estancia[] = [];

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

  estanciaSeleccionada: Estancia | null = null;
  estanciaSeleccionadaIndex: number | null = null;

seleccionarEstancia(index: number | null): void {
    if (index !== null) {
        console.log("Estancia seleccionada:", this.miEstancia[index]);
      this.estanciaSeleccionada = this.miEstancia[index];
      this.estanciaSeleccionadaIndex = index;
      console.log("Estancia seleccionada asignada:", this.estanciaSeleccionada);
    } else {
      console.log("Ninguna estancia seleccionada");
      this.estanciaSeleccionada = null;
      this.estanciaSeleccionadaIndex = null;
    }
  }
  
}