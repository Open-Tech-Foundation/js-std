import {
  filterStream,
  iterToStream,
  mapStream,
  streamToArray,
} from '../../src';

/** A stream that records how many chunks were actually pulled from it. */
function counting<T>(items: T[], pulled: T[]): ReadableStream<T> {
  let i = 0;

  return new ReadableStream<T>({
    pull(controller) {
      if (i >= items.length) {
        controller.close();
        return;
      }
      pulled.push(items[i]);
      controller.enqueue(items[i++]);
    },
  });
}

/** A stream that records whether it was cancelled, and with what. */
function cancellable<T>(items: T[], seen: { reason?: unknown }) {
  let i = 0;

  return new ReadableStream<T>({
    pull(controller) {
      if (i >= items.length) {
        controller.close();
        return;
      }
      controller.enqueue(items[i++]);
    },
    cancel(reason) {
      seen.reason = reason ?? 'cancelled';
    },
  });
}

describe('Streams > mapStream', () => {
  test('transforms every chunk', async () => {
    const res = await streamToArray(
      mapStream(iterToStream([1, 2, 3]), (n) => n * 2),
    );

    expect(res).toEqual([2, 4, 6]);
  });

  test('awaits an async callback', async () => {
    const res = await streamToArray(
      mapStream(iterToStream([1, 2]), async (n) => `#${n}`),
    );

    expect(res).toEqual(['#1', '#2']);
  });

  test('passes the chunk index', async () => {
    const res = await streamToArray(
      mapStream(iterToStream(['a', 'b', 'c']), (chunk, i) => `${i}${chunk}`),
    );

    expect(res).toEqual(['0a', '1b', '2c']);
  });

  test('gives an empty stream for an empty source', async () => {
    expect(await streamToArray(mapStream(iterToStream([]), (n) => n))).toEqual(
      [],
    );
  });

  test('does not drain the source ahead of the consumer', async () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pulled: number[] = [];
    const mapped = mapStream(counting(source, pulled), (n) => n);
    const reader = mapped.getReader();

    await reader.read();
    await reader.read();

    // Two chunks asked for, plus the one the result stream keeps queued —
    // the default for any ReadableStream, and nowhere near the whole source.
    expect(pulled).toEqual([1, 2, 3]);

    await reader.cancel();
  });

  test('cancels the source when the result is cancelled', async () => {
    const seen: { reason?: unknown } = {};
    const mapped = mapStream(cancellable([1, 2, 3], seen), (n) => n);
    const reader = mapped.getReader();

    await reader.read();
    await reader.cancel('done here');

    expect(seen.reason).toBe('done here');
  });

  test('cancels the source when the callback throws, then errors', async () => {
    const seen: { reason?: unknown } = {};
    const boom = new Error('boom');
    const mapped = mapStream(cancellable([1, 2, 3], seen), () => {
      throw boom;
    });

    await expect(streamToArray(mapped)).rejects.toThrow('boom');
    // Otherwise the source stays locked with nobody left to read it.
    expect(seen.reason).toBe(boom);
  });
});

describe('Streams > filterStream', () => {
  test('keeps only what passes', async () => {
    const res = await streamToArray(
      filterStream(iterToStream([1, 2, 3, 4, 5]), (n) => n % 2 === 0),
    );

    expect(res).toEqual([2, 4]);
  });

  test('awaits an async predicate', async () => {
    const res = await streamToArray(
      filterStream(iterToStream([1, 2, 3]), async (n) => n > 1),
    );

    expect(res).toEqual([2, 3]);
  });

  test('passes the chunk index, counting rejected chunks too', async () => {
    const seen: number[] = [];
    await streamToArray(
      filterStream(iterToStream(['a', 'b', 'c']), (_chunk, i) => {
        seen.push(i);
        return false;
      }),
    );

    expect(seen).toEqual([0, 1, 2]);
  });

  test('gives an empty stream when nothing passes', async () => {
    const res = await streamToArray(
      filterStream(iterToStream([1, 2, 3]), () => false),
    );

    expect(res).toEqual([]);
  });

  test('keeps reading past a run of rejects for one requested chunk', async () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pulled: number[] = [];
    const filtered = filterStream(counting(source, pulled), (n) => n === 4);
    const reader = filtered.getReader();

    const { value } = await reader.read();

    expect(value).toBe(4);
    // It had to scan past three rejects to satisfy one request, and stopped
    // once it had — the rest of the source is untouched.
    expect(pulled.slice(0, 4)).toEqual([1, 2, 3, 4]);
    expect(pulled.length).toBeLessThan(source.length);

    await reader.cancel();
  });

  test('cancels the source when the result is cancelled', async () => {
    const seen: { reason?: unknown } = {};
    const filtered = filterStream(cancellable([1, 2, 3], seen), () => true);
    const reader = filtered.getReader();

    await reader.read();
    await reader.cancel('done here');

    expect(seen.reason).toBe('done here');
  });

  test('cancels the source when the predicate throws, then errors', async () => {
    const seen: { reason?: unknown } = {};
    const boom = new Error('boom');
    const filtered = filterStream(cancellable([1, 2, 3], seen), () => {
      throw boom;
    });

    await expect(streamToArray(filtered)).rejects.toThrow('boom');
    expect(seen.reason).toBe(boom);
  });
});

describe('Streams > transforms compose', () => {
  test('map and filter chain', async () => {
    const res = await streamToArray(
      mapStream(
        filterStream(iterToStream([1, 2, 3, 4, 5, 6]), (n) => n % 2 === 0),
        (n) => n * 10,
      ),
    );

    expect(res).toEqual([20, 40, 60]);
  });
});
