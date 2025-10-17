import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" mode="side" opened>
        <mat-toolbar>Sistema de Facturación</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="clients" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span>Clientes</span>
          </a>
          <a mat-list-item routerLink="products" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span>Productos</span>
          </a>
          <a mat-list-item routerLink="sales" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt</mat-icon>
            <span>Ventas</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <button mat-icon-button (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </mat-toolbar>

        <div class="content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
    }
    .content {
      padding: 20px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}