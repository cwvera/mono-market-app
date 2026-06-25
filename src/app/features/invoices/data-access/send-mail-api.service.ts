import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { SendMailDto } from '@shared/models';

/**
 * Cliente HTTP del recurso `/api/send-mails`.
 * @summary Espejo de `MonoMarket.WebApi.Controllers.SendMailsController` (backend).
 */
@Injectable({ providedIn: 'root' })
export class SendMailApiService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = `${environment.apiBaseUrl}/send-mails`;

  /**
   * Lista los correos (cabeceras `SendMails`) asociados a una factura.
   * @summary `GET /api/send-mails?invoiceNumber=`.
   * @param invoiceNumber Número de la factura, obligatorio.
   */
  getByInvoiceNumber(invoiceNumber: string): Observable<SendMailDto[]> {
    const params = new HttpParams().set('invoiceNumber', invoiceNumber);
    return this.http.get<SendMailDto[]>(this.resourceUrl, { params });
  }
}
