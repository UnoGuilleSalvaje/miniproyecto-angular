// services/registro.service.ts
import { Injectable } from '@angular/core';
import { Registro } from '../interfaces/registro';

@Injectable({
    providedIn: 'root',
})
export class RegistroService {
    private readonly storageKey = 'registros';

    constructor() { }

    // Agregar un nuevo registro
    addRegistro(registro: Registro): void {
        const registros = this.getRegistros();
        registros.push(registro);
        localStorage.setItem(this.storageKey, JSON.stringify(registros));
    }

    // Obtener todos los registros
    getRegistros(): Registro[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Verificar si una fecha y hora ya está ocupada
    isDateTimeOccupied(fechaHora: string): boolean {
        const registros = this.getRegistros();
        return registros.some(registro => registro.fechaHora === fechaHora);
    }
}
