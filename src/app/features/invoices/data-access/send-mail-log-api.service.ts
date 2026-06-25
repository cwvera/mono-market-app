import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { SendMailLogDto } from '@shared/models';

/**
 * Cliente HTTP del recurso `/api/send-mails-log`.
 * @summary Espejo de `MonoMarket.WebApi.Controllers.SendMailsLogController` (backend).
 */
@Injectable({ providedIn: 'root' })
export class SendMailLogApiService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = `${environment.apiBaseUrl}/send-mails-log`;

  /**
   * Lista los intentos de envío de una cabecera `SendMail`.
   * @summary `GET /api/send-mails-log?sendMailId=`.
   * @param sendMailId Id de la cabecera `SendMail`, obligatorio.
   */
  getBySendMailId(sendMailId: string): Observable<SendMailLogDto[]> {
    const params = new HttpParams().set('sendMailId', sendMailId);
    return this.http.get<SendMailLogDto[]>(this.resourceUrl, { params });
  }
}
