import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domseguro',
  standalone: true
})
export class DomseguroPipe implements PipeTransform {

  constructor (private domSanitizer:DomSanitizer) {}

  transform(value: string, url: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl( url + value );
  }
}
