import { Pipe, PipeTransform } from '@angular/core';
import { SendMailStatus } from '../models';

/** Etiqueta legible por cada {@link SendMailStatus}. */
const LABELS: Record<SendMailStatus, string> = {
  [SendMailStatus.Pending]: 'Pendiente',
  [SendMailStatus.Sent]: 'Enviado',
  [SendMailStatus.Failed]: 'Fallido',
  [SendMailStatus.MaxRetries]: 'Reintentos agotados',
};

/**
 * Traduce un {@link SendMailStatus} numérico a su etiqueta en español.
 * @summary Pipe puro; ver {@link LABELS} para el mapeo completo.
 */
@Pipe({ name: 'sendMailStatusLabel' })
export class SendMailStatusLabelPipe implements PipeTransform {
  transform(status: SendMailStatus): string {
    return LABELS[status] ?? `Estado ${status}`;
  }
}
