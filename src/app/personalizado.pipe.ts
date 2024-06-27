import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personalizado',
  standalone: true // Marca el pipe como standalone
})
export class PersonalizadoPipe implements PipeTransform {
  // Esta función transform toma dos parámetros:
  // value: Este es el valor de entrada que deseas formatear. Se espera que sea de tipo string, es decir, un número de teléfono.
  // countryCode: Este es un parámetro opcional que representa el código de país que deseas agregar al número de teléfono. Por defecto, se asume que es +1
  transform(value: string, countryCode: string = '+1'): string {

    //Verifica si el valor de entrada es nulo o vacío. En ese caso, devuelve una cadena vacía.
    if (!value) return '';
    
    // Eliminar cualquier carácter no numérico
    const cleanedNumber = value.replace(/\D/g, '');
    
    // Agregar el código de país
    let formattedNumber = countryCode + cleanedNumber;
    
    // Formatear el número con guiones
    if (formattedNumber.length > 10) {
      formattedNumber = formattedNumber.slice(0, 3) + '-' + formattedNumber.slice(3, 6) + '-' + formattedNumber.slice(6);
    } else if (formattedNumber.length > 6) {
      formattedNumber = formattedNumber.slice(0, 3) + '-' + formattedNumber.slice(3);
    }
    
    return formattedNumber;
  }
}
