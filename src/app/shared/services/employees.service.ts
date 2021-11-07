import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface VacunationData {
  id: number;
  vacuneDate: string;
  vacuneType: 'spu' | 'ast' | 'pfi' | 'jyj';
  dosisNumber: number;
}

export interface Employee {
  id: number;
  identification: string;
  name: string;
  lastName: string;
  email: string;
  birthday: string;
  address: string;
  telephone: string;
  vacunationState: 'V' | 'N';
  username?: string;
  password?: string;
  role: string;
  VacunationData: [VacunationData?];
}

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  cabeceras: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.cabeceras = new HttpHeaders().set('Content-Type', 'application/json');
  }
  getEmployees() {
    return this.httpClient.get<Employee[]>('http://localhost:3000/employees', {
      headers: this.cabeceras,
    });
  }
  saveEmployee(employee: Employee) {
    return this.httpClient.post('http://localhost:3000/employees', employee, {
      headers: this.cabeceras,
    });
  }
  updateEmployee(id: number, employee: Employee) {
    return this.httpClient.put<Employee>('http://localhost:3000/employees/' + id, employee, {
      headers: this.cabeceras,
    });
  }
  getEmployee(id: number) {
    return this.httpClient.get<Employee>('http://localhost:3000/employees/' + id, {
      headers: this.cabeceras,
    });
  }
  deleteEmployee(id: number) {
    return this.httpClient.delete<Employee>('http://localhost:3000/employees/' + id, {
      headers: this.cabeceras,
    });
  }
}
