import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginData, RegisterData, AuthResponse, User } from '../interfaces/auth.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
        })
      );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register/`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh = localStorage.getItem('refresh_token');
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/token/refresh/`, { refresh })
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.access);
        })
      );
  }

  getCurrentUser(): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/auth/user/`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}