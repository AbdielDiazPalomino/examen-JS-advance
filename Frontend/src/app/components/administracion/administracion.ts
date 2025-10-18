import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administracion.html',
  styleUrls: ['./administracion.css']
})
export class AdministracionComponent implements OnInit {
  productos: any[] = [];
  nuevoProducto = { nombre: '', precio: 0, stock: 0 };
  apiUrl = 'http://127.0.0.1:8000/api/productos/';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get(this.apiUrl).subscribe({
      next: (res: any) => (this.productos = res),
      error: (err) => {
        console.error('Error al cargar productos', err);
      },
    });
  }

  agregarProducto() {
    this.http.post(this.apiUrl, this.nuevoProducto).subscribe({
      next: () => {
        this.nuevoProducto = { nombre: '', precio: 0, stock: 0 };
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al agregar producto', err);
        alert('Error al agregar producto');
      },
    });
  }

  irABoletear() {
    window.location.href = '/boleta';
  }
}
