export interface SaleDetail {
  producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Sale {
  id?: number;
  usuario?: number;
  cliente: number;
  fecha?: string;
  total: number;
  detalles: SaleDetail[];
}