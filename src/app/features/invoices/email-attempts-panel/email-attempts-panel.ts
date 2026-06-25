import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { SendMailLogDto, SendMailLogStatus } from '@shared/models';
import { SendMailLogStatusLabelPipe } from '@shared/pipes';
import { switchMapWhenSelected } from '@shared/utils';
import { SendMailLogApiService } from '../data-access/send-mail-log-api.service';
import { InvoiceSelectionStore } from '../data-access/invoice-selection.store';

/**
 * Lista los intentos de envío (`SendMailsLog`) del correo seleccionado.
 * @summary Vive en la pestaña "Intentos" de InvoicesSummaryPage, hermana de
 * SentEmailsPanel (no su hijo en el DOM). Igual que esa, no recibe el
 * correo por @Input: lee directamente `InvoiceSelectionStore.selectedSendMail$`
 * (misma instancia del store, inyectada jerárquicamente desde InvoicesSummaryPage).
 */
@Component({
  selector: 'app-email-attempts-panel',
  imports: [AsyncPipe, DatePipe, MatCardModule, MatTableModule, MatIconModule, SendMailLogStatusLabelPipe],
  templateUrl: './email-attempts-panel.html',
  styleUrl: './email-attempts-panel.scss',
})
export class EmailAttemptsPanel {
  private readonly store = inject(InvoiceSelectionStore);
  private readonly sendMailLogApi = inject(SendMailLogApiService);

  /** Intentos del correo seleccionado; arreglo vacío si no hay selección. */
  protected readonly attempts$: Observable<SendMailLogDto[]> = this.store.selectedSendMail$.pipe(
    switchMapWhenSelected((sendMail) => this.sendMailLogApi.getBySendMailId(sendMail.id))
  );

  /** Columnas de la tabla de intentos, en el orden en que se muestran. */
  protected readonly displayedColumns = ['attemptNumber', 'status', 'durationMs', 'sentAt', 'errorMessage'];

  /**
   * Clase CSS del chip de estado para un intento.
   * @summary Solo hay 2 valores posibles, por eso una comparación directa
   * contra {@link SendMailLogStatus} en vez de un `Record` completo; igual
   * de centralizado, sin números mágicos en el template.
   */
  protected statusClass(status: SendMailLogStatus): string {
    return status === SendMailLogStatus.Sent ? 'status-chip-success' : 'status-chip-error';
  }

  /** Ícono de Material para el estado de un intento. Ver {@link statusClass}. */
  protected statusIcon(status: SendMailLogStatus): string {
    return status === SendMailLogStatus.Sent ? 'check_circle' : 'error';
  }
}
