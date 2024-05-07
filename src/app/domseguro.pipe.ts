import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domseguro',
  standalone: true
})
export class DomseguroPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
