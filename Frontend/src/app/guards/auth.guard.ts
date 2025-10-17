import { inject } from '@angular/core';
import { Router, type CanActivateFn, UrlTree } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  return true as boolean | UrlTree;
};