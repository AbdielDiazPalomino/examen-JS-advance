import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  seleccionado?: boolean;
  cantidad?: number;
}

@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  templateUrl: './boleta.html',
  styleUrls: ['./boleta.css']
})
export class BoletaComponent implements OnInit {
  loading = false;
  error = '';
  pdfUrl: string | null = null;
  boletaGenerada = false;
  productos: Producto[] = [];
  total = 0;

  private productosUrl = 'http://127.0.0.1:8000/api/productos/';
  private ventasUrl = 'http://127.0.0.1:8000/api/ventas/';
  private clientesUrl = 'http://127.0.0.1:8000/api/clientes/';

  cliente = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<Producto[]>(this.productosUrl).subscribe({
      next: (productos) => {
        this.productos = productos.map(p => ({
          ...p,
          seleccionado: false,
          cantidad: 1
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos';
      }
    });
  }

  actualizarTotal() {
    this.total = this.productos
      .filter(p => p.seleccionado)
      .reduce((sum, p) => sum + p.precio * (p.cantidad || 1), 0);
  }

  generarBoleta() {
    const seleccionados = this.productos.filter(p => p.seleccionado && p.cantidad && p.cantidad > 0);

    if (seleccionados.length === 0) {
      this.error = 'Selecciona al menos un producto.';
      return;
    }

    if (!this.cliente.nombre.trim()) {
      this.error = 'Completa los datos del cliente.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.pdfUrl = null;

    // Crear cliente directamente
    const clienteData = { ...this.cliente };

    this.http.post<any>(this.clientesUrl, clienteData).subscribe({
      next: (clienteCreado) => {
        this.crearVentaConCliente(clienteCreado.id, seleccionados);
      },
      error: (err) => {
        console.error('❌ Error al crear cliente:', err);
        this.error = 'No se pudo crear el cliente.';
        this.loading = false;
      }
    });
  }

  private crearVentaConCliente(clienteId: number, seleccionados: Producto[]) {
    const total = seleccionados.reduce((sum, p) => sum + p.precio * (p.cantidad || 1), 0);

    const ventaData = {
      cliente: clienteId,
      total: Number(total.toFixed(2)),
      detalles: seleccionados.map(p => ({
        producto: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        subtotal: Number((p.precio * (p.cantidad || 1)).toFixed(2))
      }))
    };

    this.http.post<any>(this.ventasUrl, ventaData).subscribe({
      next: (venta) => {
        const boletaUrl = `${this.ventasUrl}${venta.id}/boleta/`;
        this.http.get(boletaUrl, { responseType: 'blob' }).subscribe({
          next: (response: Blob) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            // ✅ Descargar automáticamente el PDF
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `boleta_${venta.id}.pdf`;
            a.click();

            // ✅ Mostrar el PDF en pantalla
            this.pdfUrl = blobUrl;
            this.boletaGenerada = true;
            this.loading = false;

            // ✅ Liberar memoria después de un tiempo
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

            // 🔹 Actualizar stock de productos vendidos
            seleccionados.forEach(p => {
              const nuevoStock = Math.max(p.stock - (p.cantidad || 0), 0);
              this.http.patch(`${this.productosUrl}${p.id}/`, { stock: nuevoStock }).subscribe();
            });
          },
          error: (err) => {
            console.error('❌ Error al generar boleta PDF:', err);
            this.error = 'No se pudo generar el PDF de la boleta.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al crear venta:', err);
        this.error = err.error ? JSON.stringify(err.error) : 'Error al crear venta.';
        this.loading = false;
      }
    });
  }

  nuevaBoleta() {
    this.pdfUrl = null;
    this.boletaGenerada = false;
    this.error = '';
    this.total = 0;
    this.cargarProductos();
  }
}
