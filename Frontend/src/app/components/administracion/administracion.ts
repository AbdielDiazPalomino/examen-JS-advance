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
  editandoProducto: any = null;
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
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    this.http.post(this.apiUrl, this.nuevoProducto).subscribe({
      next: () => {
        this.nuevoProducto = { nombre: '', precio: 0, stock: 0 };
        this.cargarProductos();
        alert('Producto agregado exitosamente');
      },
      error: (err) => {
        console.error('Error al agregar producto', err);
        alert('Error al agregar producto');
      },
    });
  }

  editarProducto(producto: any) {
    this.editandoProducto = { ...producto };
    this.nuevoProducto = { 
      nombre: producto.nombre, 
      precio: producto.precio, 
      stock: producto.stock 
    };
  }

  actualizarProducto() {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const url = `${this.apiUrl}${this.editandoProducto.id}/`;
    this.http.put(url, this.nuevoProducto).subscribe({
      next: () => {
        this.nuevoProducto = { nombre: '', precio: 0, stock: 0 };
        this.editandoProducto = null;
        this.cargarProductos();
        alert('Producto actualizado exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar producto', err);
        alert('Error al actualizar producto');
      },
    });
  }

  cancelarEdicion() {
    this.nuevoProducto = { nombre: '', precio: 0, stock: 0 };
    this.editandoProducto = null;
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    const url = `${this.apiUrl}${id}/`;
    this.http.delete(url).subscribe({
      next: () => {
        this.cargarProductos();
        alert('Producto eliminado exitosamente');
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
        alert('Error al eliminar producto');
      },
    });
  }

  irABoletear() {
    window.location.href = '/boleta';
  }
}