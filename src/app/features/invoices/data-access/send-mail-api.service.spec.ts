import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '@env/environment';
import { SendMailApiService } from './send-mail-api.service';

describe('SendMailApiService', () => {
  let service: SendMailApiService;
  let httpMock: HttpTestingController;
  const resourceUrl = `${environment.apiBaseUrl}/send-mails`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SendMailApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getByInvoiceNumber sends invoiceNumber as a query param', () => {
    service.getByInvoiceNumber('FAC-001-2025').subscribe();

    const req = httpMock.expectOne((request) => request.url === resourceUrl);
    expect(req.request.params.get('invoiceNumber')).toBe('FAC-001-2025');
    req.flush([]);
  });
});
