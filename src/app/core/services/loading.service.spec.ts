import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('starts as not loading', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('is loading while at least one request is pending', () => {
    service.start();
    expect(service.isLoading()).toBe(true);

    service.start();
    service.stop();
    expect(service.isLoading()).toBe(true);

    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('never goes negative when stop is called without a matching start', () => {
    service.stop();
    service.stop();
    expect(service.isLoading()).toBe(false);

    service.start();
    expect(service.isLoading()).toBe(true);
  });
});
