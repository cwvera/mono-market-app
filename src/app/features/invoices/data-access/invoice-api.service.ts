import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { InvoiceDto, InvoiceFilter } from '@shared/models';

/**
 * Cliente HTTP del recurso `/api/invoices`.
 * @summary Espejo de `MonoMarket.WebApi.Controllers.InvoicesController` (backend).
 * Única responsabilidad: traducir llamadas tipadas a las dos rutas que
 * expone ese controller. No conoce filtros de UI ni estado de selección.
 */
@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = `${environment.apiBaseUrl}/invoices`;

  /**
   * Lista facturas, filtrando opcionalmente por cliente y/o estado.
   * @summary `GET /api/invoices`. Sin filtros, lista todas.
   * @param filter Filtros opcionales; un campo en `null` se omite del query string.
   */
  getAll(filter: InvoiceFilter): Observable<InvoiceDto[]> {
    let params = new HttpParams();
    if (filter.clientIdentification) {
      params = params.set('clientIdentification', filter.clientIdentification);
    }
    if (filter.status !== null && filter.status !== undefined) {
      params = params.set('status', filter.status);
    }
    return this.http.get<InvoiceDto[]>(this.resourceUrl, { params });
  }

  /**
   * Obtiene una factura por su número.
   * @summary `GET /api/invoices/{invoiceNumber}`.
   * @param invoiceNumber Número único de la factura, p. ej. "FAC-001-2025".
   */
  getByNumber(invoiceNumber: string): Observable<InvoiceDto> {
    return this.http.get<InvoiceDto>(`${this.resourceUrl}/${invoiceNumber}`);
  }
}
