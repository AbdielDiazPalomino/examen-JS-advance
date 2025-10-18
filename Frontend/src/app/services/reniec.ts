import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ReniecResponse {
  first_name: string;
  first_last_name: string;
  second_last_name: string;
  full_name: string;
  document_number: string;
}

@Injectable({
  providedIn: 'root'
})
export class Reniec {
  private apiUrl = 'http://localhost:8000/api/consultar-dni/';

  constructor(private http: HttpClient) {}

  consultarDNI(dni: string): Observable<ReniecResponse> {
    return this.http.get<ReniecResponse>(this.apiUrl, {
      params: {
        numero: dni
      }
    });
  }
}
