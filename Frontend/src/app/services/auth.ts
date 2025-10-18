// src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/'; // Ajusta si tu ruta base cambia

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { username, password });
  }

  // 🧾 REGISTER
  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, { username, password, email });
  }

  // 🪣 GUARDAR TOKEN
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // 🔍 OBTENER TOKEN (lo usa el interceptor)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem('token');
  }
}
