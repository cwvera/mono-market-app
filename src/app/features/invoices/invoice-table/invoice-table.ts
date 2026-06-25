import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { InvoiceDto, InvoiceStatus } from '@shared/models';
import { InvoiceStatusLabelPipe } from '@shared/pipes';

/** Clase CSS de color por cada {@link InvoiceStatus}, ver `.status-chip` en `styles.scss`. */
const STATUS_CLASSES: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Deactivated]: 'status-deactivated',
  [InvoiceStatus.Pending]: 'status-pending',
  [InvoiceStatus.Paid]: 'status-paid',
  [InvoiceStatus.FirstReminder]: 'status-first-reminder',
  [InvoiceStatus.SecondReminder]: 'status-second-reminder',
  [InvoiceStatus.ThirdReminder]: 'status-reminder',
  [InvoiceStatus.FourthReminder]: 'status-reminder',
};

/**
 * Tabla de facturas, puramente presentacional.
 * @summary No conoce el store de selección ni hace llamadas HTTP: recibe el
 * listado y la selección vigente por `input()`, y emite la fila elegida por
 * `output()`. Es InvoicesSummaryPage quien decide qué hacer con esa elección.
 */
@Component({
  selector: 'app-invoice-table',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe,
    InvoiceStatusLabelPipe,
  ],
  templateUrl: './invoice-table.html',
  styleUrl: './invoice-table.scss',
})
export class InvoiceTable {
  /** Facturas a mostrar. */
  readonly invoices = input<InvoiceDto[]>([]);
  /** Id de la factura resaltada (la seleccionada en el store), o `null`. */
  readonly selectedInvoiceId = input<string | null>(null);

  /** Emite la factura elegida al hacer clic en una fila o en el botón de detalle. */
  readonly select = output<InvoiceDto>();

  /** Columnas de la tabla, en el orden en que se muestran. */
  protected readonly displayedColumns = [
    'invoiceNumber',
    'clientIdentification',
    'amount',
    'issueDate',
    'status',
    'reminderCount',
    'actions',
  ];

  /**
   * Clase CSS del chip de estado para una factura.
   * @summary Ver {@link STATUS_CLASSES}.
   */
  protected statusClass(status: InvoiceStatus): string {
    return STATUS_CLASSES[status] ?? 'status-reminder';
  }
}
