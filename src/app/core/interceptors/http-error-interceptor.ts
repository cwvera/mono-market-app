import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/**
 * Reporta errores HTTP al usuario y los reenvía al observable original.
 * @summary No oculta el error (el `catchError` siempre relanza con
 * `throwError`); solo agrega feedback visual vía MatSnackBar además del
 * `console.error` para diagnóstico.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.error('HTTP error', err);
      const message = err.error?.message ?? `Error ${err.status}: ${err.statusText}`;
      snack.open(message, 'Cerrar', { duration: 5000 });
      return throwError(() => err);
    })
  );
};
