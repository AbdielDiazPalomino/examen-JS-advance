import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Editar' : 'Nuevo'}} Producto</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" required rows="3"></textarea>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="precio" required min="0">
          <span matPrefix>$&nbsp;</span>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Stock</mat-label>
          <input matInput type="number" formControlName="stock" required min="0">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
          {{data ? 'Actualizar' : 'Crear'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class ProductFormDialogComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.productForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      precio: [data?.precio || '', [Validators.required, Validators.min(0)]],
      stock: [data?.stock || '', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      if (this.data?.id) {
        this.productService.updateProduct(this.data.id, product)
          .subscribe({
            next: () => this.dialogRef.close(true),
            error: (error) => console.error('Error al actualizar producto:', error)
          });
      } else {
        this.productService.createProduct(product)
          .subscribe({
            next: () => this.dialogRef.close(true),
            error: (error) => console.error('Error al crear producto:', error)
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}