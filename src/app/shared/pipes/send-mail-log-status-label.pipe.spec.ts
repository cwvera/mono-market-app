import { SendMailLogStatus } from '../models';
import { SendMailLogStatusLabelPipe } from './send-mail-log-status-label.pipe';

describe('SendMailLogStatusLabelPipe', () => {
  const pipe = new SendMailLogStatusLabelPipe();

  it.each([
    [SendMailLogStatus.Sent, 'Enviado'],
    [SendMailLogStatus.Failed, 'Fallido'],
  ])('translates %s to %s', (status, label) => {
    expect(pipe.transform(status)).toBe(label);
  });

  it('falls back to a generic label for an unknown status', () => {
    expect(pipe.transform(99 as SendMailLogStatus)).toBe('Estado 99');
  });
});
