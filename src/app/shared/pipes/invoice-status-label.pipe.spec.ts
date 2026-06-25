import { InvoiceStatus } from '../models';
import { InvoiceStatusLabelPipe } from './invoice-status-label.pipe';

describe('InvoiceStatusLabelPipe', () => {
  const pipe = new InvoiceStatusLabelPipe();

  it.each([
    [InvoiceStatus.Deactivated, 'Desactivada'],
    [InvoiceStatus.Pending, 'Pendiente'],
    [InvoiceStatus.Paid, 'Pagada'],
    [InvoiceStatus.FirstReminder, 'Primer recordatorio'],
    [InvoiceStatus.SecondReminder, 'Segundo recordatorio'],
    [InvoiceStatus.ThirdReminder, 'Tercer recordatorio'],
    [InvoiceStatus.FourthReminder, 'Cuarto recordatorio'],
  ])('translates %s to %s', (status, label) => {
    expect(pipe.transform(status)).toBe(label);
  });

  it('falls back to a generic label for an unknown status', () => {
    expect(pipe.transform(99 as InvoiceStatus)).toBe('Estado 99');
  });
});
