import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrServiceService {
  private apiUrl = 'http://localhost:3000/api/random-stay'; // URL de la API

  constructor(private http: HttpClient) { }

  getQrData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
