import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Estancia } from '../estancia';
import { EstanciasService } from '../services/estancias.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-formulario',
    standalone: true,
    imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
    templateUrl: './formulario.component.html',
    styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

    formularioForm: FormGroup;
    estancia: any;  // Los datos de la estancia
    // guardar currentdate para validar que no se esocga una fecha ya pasada
    currentDate = new Date();

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
        // Inicializa el formulario con los campos y las validaciones requeridas
        this.formularioForm = this.fb.group({
            fechaHora: ['', [Validators.required, this.validateDateTimeNotOccupied]],
            nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
            telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            dias: ['', [Validators.required, Validators.min(1)]]
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
                
            });
        }
    }

    // Función de validación personalizada para verificar la fecha y hora
    validateDateTimeNotOccupied(control: { value: any; }) {
        const fechaHora = control.value;
      //  alert para decir que esa hora esta ocupada
        if (fechaHora) {
            const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
            const fechaHoraReserva = new Date(fechaHora);
            for (const reserva of reservas) {
                const fechaHoraReservaGuardada = new Date(reserva.fechaHora);
                if (fechaHoraReserva.getTime() === fechaHoraReservaGuardada.getTime()) {
                 
                    return { occupied: true };
                }
            }
        } 
        return null;
    }

    // Guardar la reservación
    guardarReservacion(): void {
      if (this.formularioForm.valid) {
          const reserva = this.formularioForm.value;
  
          // Almacenar en Local Storage
          localStorage.setItem('reserva', JSON.stringify(reserva));
          alert('Reservación guardada con éxito.');
  
          // Aquí puedes agregar cualquier lógica adicional, como redirigir a otra página
      } else {
          alert('El formulario no es válido.');
          console.log('El formulario no es válido.');
      }
  }
}
