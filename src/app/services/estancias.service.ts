import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { ESTANCIAS } from '../miEstancia';
import { Estancia } from '../estancia';

@Injectable({
  providedIn: 'root'
})
export class EstanciasService {

  urlAPI:string = "https://my-json-server.typicode.com/UnoGuilleSalvaje/miniproyecto-angular/db";
  // urlAPI:string = "https://estancias.free.beeceptor.com/";

  constructor(private http: HttpClient) { }

    retornar() {
      return this.http.get(this.urlAPI).pipe(take(1));
    }

    private estancias:Estancia[] = ESTANCIAS;

    getEstancias():Estancia[]{
      return this.estancias;
    }

    getUnaEstancia(posicion:number):Estancia{
      return this.estancias[posicion];
    }

    searchUnaEstancia(nomestancia:string):number{
      let index = this.estancias.findIndex(p => p.nombre == nomestancia);
      return index
    }
}
