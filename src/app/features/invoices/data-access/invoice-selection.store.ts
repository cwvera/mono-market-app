import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { InvoiceDto, SendMailDto } from '@shared/models';

/**
 * Estado de selección compartido del flujo factura -> correos -> intentos.
 * @summary Comparte la factura y el correo seleccionados entre el listado de
 * facturas y los paneles de correos/intentos sin encadenar @Input a través
 * de varios niveles de componentes. Se provee a nivel de InvoicesSummaryPage
 * (`providers: [InvoiceSelectionStore]`) para que la misma instancia llegue,
 * vía inyección jerárquica, a sus descendientes (SentEmailsPanel y, debajo
 * de este, EmailAttemptsPanel).
 */
@Injectable()
export class InvoiceSelectionStore {
  private readonly selectedInvoiceSubject = new BehaviorSubject<InvoiceDto | null>(null);
  private readonly selectedSendMailSubject = new BehaviorSubject<SendMailDto | null>(null);

  /** Factura seleccionada actualmente, o `null` si no hay selección. */
  readonly selectedInvoice$: Observable<InvoiceDto | null> = this.selectedInvoiceSubject.asObservable();

  /** Correo seleccionado actualmente, o `null` si no hay selección. */
  readonly selectedSendMail$: Observable<SendMailDto | null> = this.selectedSendMailSubject.asObservable();

  /**
   * Selecciona (o limpia) la factura activa.
   * @summary Limpia también el correo seleccionado: un correo de la factura
   * anterior no tiene sentido una vez que cambia la factura activa.
   */
  selectInvoice(invoice: InvoiceDto | null): void {
    this.selectedInvoiceSubject.next(invoice);
    this.selectedSendMailSubject.next(null);
  }

  /**
   * Selecciona (o limpia) el correo activo.
   * @summary No afecta la factura seleccionada (el correo siempre pertenece a ella).
   */
  selectSendMail(sendMail: SendMailDto | null): void {
    this.selectedSendMailSubject.next(sendMail);
  }
}
