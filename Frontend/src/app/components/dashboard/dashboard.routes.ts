import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'sales', pathMatch: 'full' },
      {
        path: 'clients',
        loadComponent: () => import('../clients/client-list.component')
          .then(m => m.ClientListComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('../products/product-list.component')
          .then(m => m.ProductListComponent)
      },
      {
        path: 'sales',
        loadComponent: () => import('../sales/sale-list.component')
          .then(m => m.SaleListComponent)
      },
      {
        path: 'sales/new',
        loadComponent: () => import('../sales/sale-form.component')
          .then(m => m.SaleFormComponent)
      }
    ]
  }
];