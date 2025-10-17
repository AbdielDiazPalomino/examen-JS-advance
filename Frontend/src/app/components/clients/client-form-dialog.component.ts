import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../services/client.service';
import { Client } from '../../interfaces/client.interface';

@Component({
  selector: 'app-client-form-dialog',
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
    <h2 mat-dialog-title>{{data ? 'Editar' : 'Nuevo'}} Cliente</h2>
    <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Dirección</mat-label>
          <input matInput formControlName="direccion" required>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!clientForm.valid">
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
export class ClientFormDialogComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<ClientFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) {
    this.clientForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      telefono: [data?.telefono || '', Validators.required],
      direccion: [data?.direccion || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      if (this.data?.id) {
        this.clientService.updateClient(this.data.id, this.clientForm.value)
          .subscribe({
            next: () => this.dialogRef.close(true),
            error: (error) => console.error('Error al actualizar cliente:', error)
          });
      } else {
        this.clientService.createClient(this.clientForm.value)
          .subscribe({
            next: () => this.dialogRef.close(true),
            error: (error) => console.error('Error al crear cliente:', error)
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}