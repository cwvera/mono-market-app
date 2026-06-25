import { Pipe, PipeTransform } from '@angular/core';
import { SendMailLogStatus } from '../models';

/** Etiqueta legible por cada {@link SendMailLogStatus}. */
const LABELS: Record<SendMailLogStatus, string> = {
  [SendMailLogStatus.Sent]: 'Enviado',
  [SendMailLogStatus.Failed]: 'Fallido',
};

/**
 * Traduce un {@link SendMailLogStatus} numérico a su etiqueta en español.
 * @summary Pipe puro; ver {@link LABELS} para el mapeo completo.
 */
@Pipe({ name: 'sendMailLogStatusLabel' })
export class SendMailLogStatusLabelPipe implements PipeTransform {
  transform(status: SendMailLogStatus): string {
    return LABELS[status] ?? `Estado ${status}`;
  }
}
