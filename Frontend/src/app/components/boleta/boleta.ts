import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './boleta.html',
  styleUrls: ['./boleta.css']
})
export class BoletaComponent implements OnInit {
  loading = false;
  error = '';
  pdfUrl: string | null = null;
  boletaGenerada = false;
  productos: Producto[] = [];

  private productosUrl = 'http://127.0.0.1:8000/api/productos/';
  private ventasUrl = 'http://127.0.0.1:8000/api/ventas/';
  private clientesUrl = 'http://127.0.0.1:8000/api/clientes/';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<Producto[]>(this.productosUrl).subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos';
      }
    });
  }

  generarBoleta() {
    if (this.productos.length === 0) {
      this.error = 'No hay productos para generar la boleta';
      return;
    }

    this.loading = true;
    this.error = '';
    this.pdfUrl = null;

    // Paso 1: Crear o obtener un cliente genérico
    const clienteData = {
      nombre: 'Cliente General',
      dni: '00000000',
      direccion: 'N/A',
      telefono: '',
      email: ''
    };

    // Primero intentamos obtener el cliente, si no existe lo creamos
    this.http.get<any[]>(`${this.clientesUrl}?dni=00000000`).subscribe({
      next: (clientes) => {
        let clienteId: number;
        
        if (clientes && clientes.length > 0) {
          // Cliente ya existe
          clienteId = clientes[0].id;
          this.crearVentaConCliente(clienteId);
        } else {
          // Crear nuevo cliente
          this.http.post<any>(this.clientesUrl, clienteData).subscribe({
            next: (cliente) => {
              this.crearVentaConCliente(cliente.id);
            },
            error: (err) => {
              console.error('❌ Error al crear cliente:', err);
              this.error = 'No se pudo crear el cliente.';
              this.loading = false;
            }
          });
        }
      },
      error: (err) => {
        // Si falla el GET, intentamos crear el cliente directamente
        this.http.post<any>(this.clientesUrl, clienteData).subscribe({
          next: (cliente) => {
            this.crearVentaConCliente(cliente.id);
          },
          error: (err) => {
            console.error('❌ Error al crear cliente:', err);
            this.error = 'No se pudo crear el cliente.';
            this.loading = false;
          }
        });
      }
    });
  }

  private crearVentaConCliente(clienteId: number) {
    // Calcular el total correctamente como número
    const total = this.productos.reduce((sum, p) => sum + Number(p.precio), 0);

    // Paso 2: Crear la venta con los detalles
    const ventaData = {
      cliente: clienteId,
      total: Number(total.toFixed(2)),
      detalles: this.productos.map(p => ({
        producto: p.id,
        cantidad: 1,
        precio_unitario: Number(p.precio),
        subtotal: Number(p.precio)
      }))
    };

    console.log('Datos de venta a enviar:', ventaData); // Para debug

    this.http.post<any>(this.ventasUrl, ventaData).subscribe({
      next: (venta) => {
        // Paso 3: Usar el ID de la venta creada para generar la boleta
        const boletaUrl = `${this.ventasUrl}${venta.id}/boleta/`;
        
        this.http.get(boletaUrl, { responseType: 'blob' }).subscribe({
          next: (response: Blob) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            this.pdfUrl = URL.createObjectURL(blob);
            this.loading = false;
            this.boletaGenerada = true;
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
        if (err.error) {
          console.error('Detalles del error:', err.error);
          this.error = `Error al crear venta: ${JSON.stringify(err.error)}`;
        } else {
          this.error = 'No se pudo crear la venta. Verifica tu backend.';
        }
        this.loading = false;
      }
    });
  }

  nuevaBoleta() {
    this.pdfUrl = null;
    this.boletaGenerada = false;
    this.error = '';
    this.cargarProductos();
  }
}