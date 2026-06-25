import { SendMailStatus } from '../models';
import { SendMailStatusLabelPipe } from './send-mail-status-label.pipe';

describe('SendMailStatusLabelPipe', () => {
  const pipe = new SendMailStatusLabelPipe();

  it.each([
    [SendMailStatus.Pending, 'Pendiente'],
    [SendMailStatus.Sent, 'Enviado'],
    [SendMailStatus.Failed, 'Fallido'],
    [SendMailStatus.MaxRetries, 'Reintentos agotados'],
  ])('translates %s to %s', (status, label) => {
    expect(pipe.transform(status)).toBe(label);
  });

  it('falls back to a generic label for an unknown status', () => {
    expect(pipe.transform(99 as SendMailStatus)).toBe('Estado 99');
  });
});
