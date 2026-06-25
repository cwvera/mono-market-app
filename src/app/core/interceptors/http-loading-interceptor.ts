import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { LoadingService } from '../services/loading.service';

/**
 * Marca el inicio/fin de cada petición HTTP en {@link LoadingService}.
 * @summary Incrementa el contador antes de despachar la request y lo
 * decrementa en `finalize` (corre tanto en éxito como en error).
 */
export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};
