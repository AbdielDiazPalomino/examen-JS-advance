import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { Client } from '../../interfaces/client.interface';
import { ClientFormDialogComponent } from './client-form-dialog.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Clientes</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Cliente
        </button>
      </div>

      <table mat-table [dataSource]="clients" class="mat-elevation-z8">
        <ng-container matColumnDef="nombre">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let client">{{client.nombre}}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let client">{{client.email}}</td>
        </ng-container>

        <ng-container matColumnDef="telefono">
          <th mat-header-cell *matHeaderCellDef>Teléfono</th>
          <td mat-cell *matCellDef="let client">{{client.telefono}}</td>
        </ng-container>

        <ng-container matColumnDef="direccion">
          <th mat-header-cell *matHeaderCellDef>Dirección</th>
          <td mat-cell *matCellDef="let client">{{client.direccion}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let client">
            <button mat-icon-button color="primary" (click)="openDialog(client)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteClient(client)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns = ['nombre', 'email', 'telefono', 'direccion', 'actions'];

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  openDialog(client?: Client): void {
    const dialogRef = this.dialog.open(ClientFormDialogComponent, {
      width: '400px',
      data: client
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  deleteClient(client: Client): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => this.loadClients(),
        error: (error) => console.error('Error al eliminar cliente:', error)
      });
    }
  }
}