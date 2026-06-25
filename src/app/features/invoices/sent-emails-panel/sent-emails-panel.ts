import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { SendMailDto, SendMailStatus } from '@shared/models';
import { SendMailStatusLabelPipe } from '@shared/pipes';
import { switchMapWhenSelected } from '@shared/utils';
import { SendMailApiService } from '../data-access/send-mail-api.service';
import { InvoiceSelectionStore } from '../data-access/invoice-selection.store';

/** Clase CSS de color por cada {@link SendMailStatus}, ver `.send-mail-status-*` en `styles.scss`. */
const STATUS_CLASSES: Record<SendMailStatus, string> = {
  [SendMailStatus.Pending]: 'send-mail-status-pending',
  [SendMailStatus.Sent]: 'send-mail-status-sent',
  [SendMailStatus.Failed]: 'send-mail-status-failed',
  [SendMailStatus.MaxRetries]: 'send-mail-status-max-retries',
};

/**
 * Lista los correos (`SendMails`) enviados para la factura seleccionada.
 * @summary Vive en la pestaña "Correos" de InvoicesSummaryPage. No recibe
 * la factura por @Input: se suscribe directamente a
 * `InvoiceSelectionStore.selectedInvoice$` para evitar prop-drilling, ya que
 * la misma selección también la necesita EmailAttemptsPanel (pestaña
 * "Intentos", hermana de esta en el flujo, no descendiente en el DOM).
 */
@Component({
  selector: 'app-sent-emails-panel',
  imports: [AsyncPipe, DatePipe, MatCardModule, MatTableModule, SendMailStatusLabelPipe],
  templateUrl: './sent-emails-panel.html',
  styleUrl: './sent-emails-panel.scss',
})
export class SentEmailsPanel {
  private readonly store = inject(InvoiceSelectionStore);
  private readonly sendMailApi = inject(SendMailApiService);

  /** Correos de la factura seleccionada; arreglo vacío si no hay selección. */
  protected readonly sendMails$: Observable<SendMailDto[]> = this.store.selectedInvoice$.pipe(
    switchMapWhenSelected((invoice) => this.sendMailApi.getByInvoiceNumber(invoice.invoiceNumber))
  );

  /** Columnas de la tabla de correos, en el orden en que se muestran. */
  protected readonly displayedColumns = ['subject', 'toEmail', 'status', 'totalAttempts', 'lastAttemptAt'];

  /**
   * Clase CSS del chip de estado para un correo.
   * @summary Ver {@link STATUS_CLASSES}. Centralizado aquí en vez de
   * concatenar el número de estado directamente en el template.
   */
  protected statusClass(status: SendMailStatus): string {
    return STATUS_CLASSES[status] ?? 'status-reminder';
  }

  /**
   * Selecciona un correo en el store compartido.
   * @summary Habilita que aparezca la pestaña "Intentos de envío"; no
   * cambia de pestaña automáticamente (el usuario decide cuándo verla).
   */
  protected select(sendMail: SendMailDto): void {
    this.store.selectSendMail(sendMail);
  }
}
