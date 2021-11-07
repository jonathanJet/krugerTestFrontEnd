import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from './interface';
import { Employee } from '@shared/services/employees.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected http: HttpClient) {}

  login(email: string, password: string, rememberMe = false) {
    return this.http.post<TokenResponse | any>('/auth/login', {
      email,
      password,
      remember_me: rememberMe,
    });
  }

  refresh() {
    return this.http.post<TokenResponse | any>('/auth/refresh', {});
  }

  logout() {
    return this.http.post('/auth/logout', {});
  }

  me() {
    return this.http.get<Employee>('/me');
  }

  menu() {
    return this.http.get('/me/menu');
  }
}
