import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {
  private apiUrl = 'https://dniruc.apisperu.com/api/v1';
  private apiToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiZGllbGRpYXpwYWxvbWlub0BnbWFpbC5jb20ifQ.J7L-JXqbfPweP9RgXq4YZipLT8O0Cz1BmCBs5vMgO0w'; // Replace with your API token

  constructor(private http: HttpClient) {}

  consultarDNI(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/dni/${dni}?token=${this.apiToken}`).pipe(
      map((response: any) => ({
        success: true,
        nombres: `${response.nombres} ${response.apellidoPaterno} ${response.apellidoMaterno}`.trim(),
        data: response
      })),
      catchError(error => of({
        success: false,
        error: 'No se pudo consultar el DNI'
      }))
    );
  }
}