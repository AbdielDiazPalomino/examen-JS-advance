import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../interfaces/sale.interface';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Ventas</h2>
        <button mat-raised-button color="primary" (click)="navigateToNewSale()">
          <mat-icon>add</mat-icon>
          Nueva Venta
        </button>
      </div>

      <table mat-table [dataSource]="sales" class="mat-elevation-z8">
        <ng-container matColumnDef="fecha">
          <th mat-header-cell *matHeaderCellDef>Fecha</th>
          <td mat-cell *matCellDef="let sale">{{sale.fecha | date:'short'}}</td>
        </ng-container>

        <ng-container matColumnDef="cliente">
          <th mat-header-cell *matHeaderCellDef>Cliente</th>
          <td mat-cell *matCellDef="let sale">{{sale.cliente?.nombre}}</td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let sale">{{sale.total | currency:'USD'}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let sale">
            <button mat-icon-button color="primary" (click)="viewDetails(sale)">
              <mat-icon>visibility</mat-icon>
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
export class SaleListComponent implements OnInit {
  sales: Sale[] = [];
  displayedColumns = ['fecha', 'cliente', 'total', 'actions'];

  constructor(
    private saleService: SaleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.getSales().subscribe(sales => {
      this.sales = sales;
    });
  }

  navigateToNewSale(): void {
    this.router.navigate(['/sales/new']);
  }

  viewDetails(sale: Sale): void {
    this.router.navigate(['/sales', sale.id]);
  }
}