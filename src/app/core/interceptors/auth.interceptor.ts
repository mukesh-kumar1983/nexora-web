import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SKIP_ERROR_HANDLING } from './skip-error.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      const skipError = req.context.get(SKIP_ERROR_HANDLING);

      // =========================
      // 🔐 AUTH HANDLING (ALWAYS RUN)
      // =========================

      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url }
        });
      }

      if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }

      // =========================
      // 🚫 SKIP FLAG HANDLING
      // =========================
      if (skipError) {
        return throwError(() => error);
      }

      // =========================
      // 📤 ALWAYS RETURN (FIX FOR TS7030)
      // =========================
      return throwError(() => error);
    })
  );
};
