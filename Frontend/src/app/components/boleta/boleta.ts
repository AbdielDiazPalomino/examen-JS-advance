// src/app/pages/boleta/boleta.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './boleta.html',
  styleUrls: ['./boleta.css']
})
export class BoletaComponent {
  loading = false;
  error = '';
  pdfUrl: string | null = null;

  private apiUrl = 'http://127.0.0.1:8000/api/ventas/1/boleta/'; // Ajusta el ID dinámico si lo necesitas

  constructor(private http: HttpClient) {}

  generarBoleta() {
    this.loading = true;
    this.error = '';
    this.pdfUrl = null;

    this.http.get(this.apiUrl, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.pdfUrl = URL.createObjectURL(blob);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al generar boleta:', err);
        this.error = 'No se pudo generar la boleta. Inténtalo nuevamente.';
        this.loading = false;
      }
    });
  }
}
