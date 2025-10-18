import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {
  private apiUrl = 'http://localhost:8000/api/consultar-dni/';

  constructor(private http: HttpClient) {}

  consultarDNI(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?numero=${dni}`).pipe(
      map((response: any) => ({
        success: true,
        nombres: response.full_name,
        data: response
      })),
      catchError(error => of({
        success: false,
        error: 'No se pudo consultar el DNI'
      }))
    );
  }
}
