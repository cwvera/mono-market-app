import { Injectable, computed, signal } from '@angular/core';

/**
 * Estado global de carga de peticiones HTTP en curso.
 * @summary Cuenta peticiones activas con un signal; `isLoading` es `true`
 * mientras el contador sea mayor a cero. Lo alimenta `httpLoadingInterceptor`
 * en cada request/finalize y lo consume el shell de la app (barra de progreso).
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pendingRequests = signal(0);

  /** `true` mientras haya al menos una petición HTTP en curso. */
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  /** Registra el inicio de una petición HTTP. */
  start(): void {
    this.pendingRequests.update((count) => count + 1);
  }

  /** Registra el fin de una petición HTTP (éxito o error). */
  stop(): void {
    this.pendingRequests.update((count) => Math.max(0, count - 1));
  }
}
