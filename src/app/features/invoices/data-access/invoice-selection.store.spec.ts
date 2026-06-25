import { firstValueFrom } from 'rxjs';

import { InvoiceDto, InvoiceStatus, SendMailDto, SendMailStatus, SendMailTemplateType } from '@shared/models';
import { InvoiceSelectionStore } from './invoice-selection.store';

const invoice: InvoiceDto = {
  id: 'inv-1',
  invoiceNumber: 'FAC-001-2025',
  clientIdentification: '900123456-7',
  amount: 1000,
  issueDate: '2025-01-01T00:00:00Z',
  status: InvoiceStatus.SecondReminder,
  lastReminderSentAt: null,
  reminderCount: 1,
};

const sendMail: SendMailDto = {
  id: 'mail-1',
  invoiceNumber: invoice.invoiceNumber,
  toEmail: 'cliente@example.com',
  toName: 'Cliente',
  templateType: SendMailTemplateType.SecondReminder,
  subject: 'Segundo recordatorio',
  status: SendMailStatus.Sent,
  totalAttempts: 1,
  lastAttemptAt: '2025-01-02T00:00:00Z',
  data: '{}',
  createdAt: '2025-01-02T00:00:00Z',
  updatedAt: '2025-01-02T00:00:00Z',
};

describe('InvoiceSelectionStore', () => {
  let store: InvoiceSelectionStore;

  beforeEach(() => {
    store = new InvoiceSelectionStore();
  });

  it('starts with no invoice and no sendMail selected', async () => {
    expect(await firstValueFrom(store.selectedInvoice$)).toBeNull();
    expect(await firstValueFrom(store.selectedSendMail$)).toBeNull();
  });

  it('selectInvoice updates selectedInvoice$', async () => {
    store.selectInvoice(invoice);
    expect(await firstValueFrom(store.selectedInvoice$)).toEqual(invoice);
  });

  it('selectInvoice clears any previously selected sendMail', async () => {
    store.selectSendMail(sendMail);
    expect(await firstValueFrom(store.selectedSendMail$)).toEqual(sendMail);

    store.selectInvoice(invoice);
    expect(await firstValueFrom(store.selectedSendMail$)).toBeNull();
  });

  it('selectSendMail does not affect the selected invoice', async () => {
    store.selectInvoice(invoice);
    store.selectSendMail(sendMail);

    expect(await firstValueFrom(store.selectedInvoice$)).toEqual(invoice);
    expect(await firstValueFrom(store.selectedSendMail$)).toEqual(sendMail);
  });

  it('selectInvoice(null) clears both the invoice and the sendMail', async () => {
    store.selectInvoice(invoice);
    store.selectSendMail(sendMail);

    store.selectInvoice(null);

    expect(await firstValueFrom(store.selectedInvoice$)).toBeNull();
    expect(await firstValueFrom(store.selectedSendMail$)).toBeNull();
  });
});
