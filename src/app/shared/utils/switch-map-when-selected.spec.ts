import { Subject, firstValueFrom, of, toArray } from 'rxjs';

import { switchMapWhenSelected } from './switch-map-when-selected';

describe('switchMapWhenSelected', () => {
  it('emits an empty array without calling fetch when the selection is null', async () => {
    const fetch = vi.fn(() => of(['should not be called']));

    const result = await firstValueFrom(of(null).pipe(switchMapWhenSelected(fetch)));

    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('calls fetch with the selection and forwards its result', async () => {
    const fetch = vi.fn((selection: string) => of([`data-for-${selection}`]));

    const result = await firstValueFrom(of('abc').pipe(switchMapWhenSelected(fetch)));

    expect(fetch).toHaveBeenCalledWith('abc');
    expect(result).toEqual(['data-for-abc']);
  });

  it('switches to the latest selection, cancelling the previous fetch', async () => {
    const source = new Subject<string | null>();
    const pending = new Map<string, Subject<string[]>>();
    const fetch = vi.fn((selection: string) => {
      const inner = new Subject<string[]>();
      pending.set(selection, inner);
      return inner;
    });

    const resultsPromise = firstValueFrom(source.pipe(switchMapWhenSelected(fetch), toArray()));

    source.next('first');
    source.next('second');
    pending.get('first')!.next(['stale']); // ignored: switchMap already unsubscribed it
    pending.get('second')!.next(['fresh']);
    pending.get('second')!.complete();
    source.complete();

    expect(await resultsPromise).toEqual([['fresh']]);
  });
});
