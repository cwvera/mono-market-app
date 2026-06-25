import { Pipe, PipeTransform } from '@angular/core';
import { InvoiceStatus } from '../models';

/** Etiqueta legible por cada {@link InvoiceStatus}. */
const LABELS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Deactivated]: 'Desactivada',
  [InvoiceStatus.Pending]: 'Pendiente',
  [InvoiceStatus.Paid]: 'Pagada',
  [InvoiceStatus.FirstReminder]: 'Primer recordatorio',
  [InvoiceStatus.SecondReminder]: 'Segundo recordatorio',
  [InvoiceStatus.ThirdReminder]: 'Tercer recordatorio',
  [InvoiceStatus.FourthReminder]: 'Cuarto recordatorio',
};

/**
 * Traduce un {@link InvoiceStatus} numérico a su etiqueta en español.
 * @summary Pipe puro; centraliza el mapeo para que agregar un nuevo estado
 * solo implique tocar {@link LABELS}, no cada template que muestre el estado.
 */
@Pipe({ name: 'invoiceStatusLabel' })
export class InvoiceStatusLabelPipe implements PipeTransform {
  transform(status: InvoiceStatus): string {
    return LABELS[status] ?? `Estado ${status}`;
  }
}
