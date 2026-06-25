import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '@env/environment';
import { SendMailLogApiService } from './send-mail-log-api.service';

describe('SendMailLogApiService', () => {
  let service: SendMailLogApiService;
  let httpMock: HttpTestingController;
  const resourceUrl = `${environment.apiBaseUrl}/send-mails-log`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SendMailLogApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getBySendMailId sends sendMailId as a query param', () => {
    service.getBySendMailId('mail-1').subscribe();

    const req = httpMock.expectOne((request) => request.url === resourceUrl);
    expect(req.request.params.get('sendMailId')).toBe('mail-1');
    req.flush([]);
  });
});
