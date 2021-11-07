import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Vacunes {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class VacunesService {
  cabeceras: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.cabeceras = new HttpHeaders().set('Content-Type', 'application/json');
  }
  getVacunes() {
    return this.httpClient.get<Vacunes[]>('http://localhost:3000/vacunes', {
      headers: this.cabeceras,
    });
  }
}
