import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';
import { Client } from '../../interfaces/client.interface';
import { Product } from '../../interfaces/product.interface';
import { Sale, SaleDetail } from '../../interfaces/sale.interface';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="container">
      <h2>Nueva Venta</h2>
      <form [formGroup]="saleForm" (ngSubmit)="onSubmit()">
        <div class="form-section">
          <h3>Cliente</h3>
          <mat-form-field>
            <mat-label>Seleccionar Cliente</mat-label>
            <mat-select formControlName="cliente">
              <mat-option *ngFor="let client of clients" [value]="client.id">
                {{client.nombre}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-section">
          <h3>Productos</h3>
          <div class="products-table">
            <table mat-table [dataSource]="productsFormArray.controls">
              <ng-container matColumnDef="producto">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let item">
                  <mat-form-field [formGroup]="item">
                    <mat-select formControlName="producto_id">
                      <mat-option *ngFor="let product of products" [value]="product.id">
                        {{"$" + product.precio + " - " + product.nombre}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </td>
              </ng-container>

              <ng-container matColumnDef="cantidad">
                <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                <td mat-cell *matCellDef="let item">
                  <mat-form-field [formGroup]="item">
                    <input matInput type="number" formControlName="cantidad" min="1">
                  </mat-form-field>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>
                  <button mat-mini-fab color="primary" (click)="addProduct()">
                    <mat-icon>add</mat-icon>
                  </button>
                </th>
                <td mat-cell *matCellDef="let item; let i = index">
                  <button mat-icon-button color="warn" (click)="removeProduct(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!saleForm.valid">
            Crear Venta
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .form-section {
      margin-bottom: 24px;
    }
    .products-table {
      margin: 16px 0;
    }
    table {
      width: 100%;
    }
    .mat-column-cantidad mat-form-field {
      width: 100px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class SaleFormComponent implements OnInit {
  saleForm: FormGroup;
  clients: Client[] = [];
  products: Product[] = [];
  displayedColumns = ['producto', 'cantidad', 'actions'];

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private clientService: ClientService,
    private productService: ProductService,
    private router: Router
  ) {
    this.saleForm = this.fb.group({
      cliente: ['', Validators.required],
      productos: this.fb.array([])
    });
  }

  get productsFormArray() {
    return this.saleForm.get('productos') as FormArray;
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
    this.addProduct(); // Add first product row
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      producto_id: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addProduct(): void {
    this.productsFormArray.push(this.createProductFormGroup());
  }

  removeProduct(index: number): void {
    this.productsFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.saleForm.valid && this.productsFormArray.length > 0) {
      const saleData: Sale = {
        cliente: this.saleForm.value.cliente,
        total: 0, // The backend will calculate the total
        detalles: this.saleForm.value.productos.map((p: { producto_id: number; cantidad: number }) => ({
          producto: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: 0, // The backend will set this
          subtotal: 0 // The backend will calculate this
        }))
      };

      this.saleService.createSale(saleData).subscribe({
        next: () => {
          this.router.navigate(['/sales']);
        },
        error: (error) => console.error('Error al crear venta:', error)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/sales']);
  }
}