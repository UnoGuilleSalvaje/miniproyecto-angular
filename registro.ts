 // models/reservacion.ts
export interface Registro {
    fechaHora: string; // Fecha y hora de la reservación
    nombre: string; // Nombre de quien reserva
    telefono: string; // Teléfono de quien reserva
    correo: string; // Correo de quien reserva
    precio: number; // Precio de la reservación
    direccion: string; // Dirección del lugar
    imagen: string; // URL de la imagen de la casa/apartamento
    dias: number; // Días de duración de la estancia
}
