import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '@env/environment';
import { InvoiceDto, InvoiceStatus } from '@shared/models';
import { InvoiceApiService } from './invoice-api.service';

describe('InvoiceApiService', () => {
  let service: InvoiceApiService;
  let httpMock: HttpTestingController;
  const resourceUrl = `${environment.apiBaseUrl}/invoices`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InvoiceApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll requests the resource without query params when the filter is empty', () => {
    service.getAll({ clientIdentification: null, status: null }).subscribe();

    const req = httpMock.expectOne((request) => request.url === resourceUrl);
    expect(req.request.params.keys().length).toBe(0);
    req.flush([]);
  });

  it('getAll forwards clientIdentification and status as query params', () => {
    service.getAll({ clientIdentification: '900123456-7', status: InvoiceStatus.SecondReminder }).subscribe();

    const req = httpMock.expectOne((request) => request.url === resourceUrl);
    expect(req.request.params.get('clientIdentification')).toBe('900123456-7');
    expect(req.request.params.get('status')).toBe(String(InvoiceStatus.SecondReminder));
    req.flush([]);
  });

  it('getByNumber requests /invoices/{invoiceNumber}', () => {
    const invoice: InvoiceDto = {
      id: 'inv-1',
      invoiceNumber: 'FAC-001-2025',
      clientIdentification: '900123456-7',
      amount: 1000,
      issueDate: '2025-01-01T00:00:00Z',
      status: InvoiceStatus.Pending,
      lastReminderSentAt: null,
      reminderCount: 0,
    };

    service.getByNumber('FAC-001-2025').subscribe((result) => {
      expect(result).toEqual(invoice);
    });

    const req = httpMock.expectOne(`${resourceUrl}/FAC-001-2025`);
    expect(req.request.method).toBe('GET');
    req.flush(invoice);
  });
});
