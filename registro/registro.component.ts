// registro.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Registro } from '../interfaces/registro';
import { RegistroService } from '../services/registro.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
    registroForm: FormGroup;

    constructor(private fb: FormBuilder, private registroService: RegistroService) {
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

        ngOnInit(): void { }

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
}
