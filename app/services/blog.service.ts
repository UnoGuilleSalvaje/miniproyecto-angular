import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { blogos } from '../blogs';
import { BLOGS } from '../miBlog';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogesService {

  urlAPI:string = "https://github.com/UnoGuilleSalvaje/miniproyecto-angular/blob/main/db_blog.json";
  // urlAPI:string = "https://estancias.free.beeceptor.com/";

  constructor(private http: HttpClient) { }

    retornar() {
      return this.http.get(this.urlAPI).pipe(take(1));
    }

    private blog:blogos[] = BLOGS;

    getbloges():blogos[]{
      return this.blog;
    }

    getUnaEstancia(posicion:number):blogos{
      return this.blog[posicion];
    }

    searchUnaEstancia(nomestancia:string):number{
      let index = this.blog.findIndex(p => p.nombre == nomestancia);
      return index
    }
}
