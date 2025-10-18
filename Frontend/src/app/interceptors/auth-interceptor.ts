import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  console.log('🔑 Token actual:', token); // 👈 agrega esto temporalmente

  // Clonamos la request para agregar encabezados
  const cloned = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  return next(cloned);
};
