import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstanciasService {

  urlAPI:string = "https://estancias.free.beeceptor.com/";

  constructor(private http: HttpClient) { }

    retornar() {
      return this.http.get(this.urlAPI).pipe(take(1));
    }
}
