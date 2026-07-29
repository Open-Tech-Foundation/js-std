import {
  concatStreams,
  filterIterAsync,
  iterToStream,
  mapIterAsync,
  mergeStreams,
  streamToArray,
  streamToBytes,
  streamToIter,
  streamToLines,
  streamToText,
  stringToBytes,
  takeIterAsync,
  toArrayIterAsync,
} from '../../src';

function fromArray<T>(chunks: T[]): ReadableStream<T> {
  return new ReadableStream<T>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

/** A stream that yields each chunk after a tick, so ordering is observable. */
function slowStream<T>(chunks: T[], delay: number): ReadableStream<T> {
  let index = 0;

  return new ReadableStream<T>({
    async pull(controller) {
      if (index >= chunks.length) {
        controller.close();
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      controller.enqueue(chunks[index++]);
    },
  });
}

function failingStream(error: Error): ReadableStream<string> {
  return new ReadableStream<string>({
    start(controller) {
      controller.enqueue('first');
      controller.error(error);
    },
  });
}

async function collect<T>(stream: ReadableStream<T>): Promise<T[]> {
  return streamToArray(stream);
}

describe('streamToText', () => {
  test('decodes byte chunks', async () => {
    const stream = fromArray([stringToBytes('Hello '), stringToBytes('World')]);

    expect(await streamToText(stream)).toBe('Hello World');
  });

  test('concatenates string chunks', async () => {
    expect(await streamToText(fromArray(['a', 'b', 'c']))).toBe('abc');
  });

  test('decodes a multi-byte character split across chunks', async () => {
    const bytes = stringToBytes('héllo 🌍');
    // Split mid-character: the emoji is four bytes.
    const stream = fromArray([bytes.slice(0, 3), bytes.slice(3)]);

    expect(await streamToText(stream)).toBe('héllo 🌍');
  });

  test('splits every byte into its own chunk', async () => {
    const bytes = stringToBytes('🌍🔐é');
    const stream = fromArray([...bytes].map((b) => new Uint8Array([b])));

    expect(await streamToText(stream)).toBe('🌍🔐é');
  });

  test('handles an empty stream', async () => {
    expect(await streamToText(fromArray([]))).toBe('');
  });

  test('propagates a stream error', async () => {
    await expect(
      streamToText(failingStream(new Error('boom'))),
    ).rejects.toThrow('boom');
  });
});

describe('streamToBytes', () => {
  test('concatenates byte chunks', async () => {
    const stream = fromArray([
      new Uint8Array([1, 2]),
      new Uint8Array([3]),
      new Uint8Array([4, 5]),
    ]);

    expect(await streamToBytes(stream)).toEqual(
      new Uint8Array([1, 2, 3, 4, 5]),
    );
  });

  test('handles an empty stream', async () => {
    expect(await streamToBytes(fromArray([]))).toEqual(new Uint8Array([]));
  });

  test('handles empty chunks', async () => {
    const stream = fromArray([
      new Uint8Array([1]),
      new Uint8Array([]),
      new Uint8Array([2]),
    ]);

    expect(await streamToBytes(stream)).toEqual(new Uint8Array([1, 2]));
  });

  test('round-trips through streamToText', async () => {
    const bytes = await streamToBytes(fromArray([stringToBytes('Hello 🌍')]));
    expect(await streamToText(fromArray([bytes]))).toBe('Hello 🌍');
  });
});

describe('streamToArray', () => {
  test('collects chunks of any type', async () => {
    expect(await streamToArray(fromArray([1, 2, 3]))).toEqual([1, 2, 3]);
    expect(await streamToArray(fromArray([{ a: 1 }, { b: 2 }]))).toEqual([
      { a: 1 },
      { b: 2 },
    ]);
  });

  test('preserves order', async () => {
    expect(await streamToArray(slowStream(['a', 'b', 'c'], 1))).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  test('handles an empty stream', async () => {
    expect(await streamToArray(fromArray([]))).toEqual([]);
  });

  test('propagates a stream error', async () => {
    await expect(
      streamToArray(failingStream(new Error('boom'))),
    ).rejects.toThrow('boom');
  });
});

describe('streamToLines', () => {
  async function lines(
    stream: ReadableStream<Uint8Array | string>,
  ): Promise<string[]> {
    const out: string[] = [];
    for await (const line of streamToLines(stream)) {
      out.push(line);
    }
    return out;
  }

  test('splits on newlines', async () => {
    expect(await lines(fromArray(['a\nb\nc']))).toEqual(['a', 'b', 'c']);
  });

  test('handles CRLF terminators', async () => {
    expect(await lines(fromArray(['a\r\nb\r\nc']))).toEqual(['a', 'b', 'c']);
    expect(await lines(fromArray(['a\r\nb\nc\r\n']))).toEqual(['a', 'b', 'c']);
  });

  test('does not invent a line for a trailing terminator', async () => {
    expect(await lines(fromArray(['a\nb\n']))).toEqual(['a', 'b']);
    expect(await lines(fromArray(['a\r\n']))).toEqual(['a']);
  });

  test('yields a final line with no terminator', async () => {
    expect(await lines(fromArray(['a\nb']))).toEqual(['a', 'b']);
  });

  test('preserves blank lines in the middle', async () => {
    expect(await lines(fromArray(['a\n\nb']))).toEqual(['a', '', 'b']);
    expect(await lines(fromArray(['a\n\n\nb']))).toEqual(['a', '', '', 'b']);
  });

  test('joins a line split across chunks', async () => {
    expect(await lines(fromArray(['he', 'llo\nwor', 'ld']))).toEqual([
      'hello',
      'world',
    ]);
  });

  test('handles a terminator split across chunks', async () => {
    expect(await lines(fromArray(['a\r', '\nb']))).toEqual(['a', 'b']);
  });

  test('decodes byte chunks, including split characters', async () => {
    const bytes = stringToBytes('héllo\n🌍');
    expect(await lines(fromArray([bytes.slice(0, 3), bytes.slice(3)]))).toEqual(
      ['héllo', '🌍'],
    );
  });

  test('handles an empty stream', async () => {
    expect(await lines(fromArray([]))).toEqual([]);
    expect(await lines(fromArray(['']))).toEqual([]);
  });

  test('streams lazily rather than buffering the whole body', async () => {
    let produced = 0;

    const stream = new ReadableStream<string>({
      pull(controller) {
        produced++;
        if (produced > 5) {
          controller.close();
          return;
        }
        controller.enqueue(`line${produced}\n`);
      },
    });

    for await (const line of streamToLines(stream)) {
      expect(line).toBe('line1');
      // Exiting early must not require the rest of the stream.
      break;
    }

    expect(produced).toBeLessThan(5);
  });

  test('parses NDJSON', async () => {
    const body = '{"a":1}\n{"a":2}\n{"a":3}\n';
    const parsed: unknown[] = [];

    for await (const line of streamToLines(fromArray([stringToBytes(body)]))) {
      parsed.push(JSON.parse(line));
    }

    expect(parsed).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });
});

describe('concatStreams', () => {
  test('joins streams end to end', async () => {
    const stream = concatStreams(
      fromArray(['a', 'b']),
      fromArray(['c']),
      fromArray(['d', 'e']),
    );

    expect(await collect(stream)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  test('preserves order even when an earlier stream is slower', async () => {
    const stream = concatStreams(
      slowStream(['a', 'b'], 5),
      slowStream(['c', 'd'], 1),
    );

    expect(await collect(stream)).toEqual(['a', 'b', 'c', 'd']);
  });

  test('skips empty streams', async () => {
    const stream = concatStreams(
      fromArray([]),
      fromArray(['a']),
      fromArray([]),
      fromArray(['b']),
    );

    expect(await collect(stream)).toEqual(['a', 'b']);
  });

  test('handles no streams at all', async () => {
    expect(await collect(concatStreams())).toEqual([]);
  });

  test('handles a single stream', async () => {
    expect(await collect(concatStreams(fromArray(['a'])))).toEqual(['a']);
  });

  test('concatenates text streams', async () => {
    const stream = concatStreams(
      fromArray([stringToBytes('Hello ')]),
      fromArray([stringToBytes('World')]),
    );

    expect(await streamToText(stream)).toBe('Hello World');
  });

  test('pulls lazily rather than draining every source up front', async () => {
    let produced = 0;

    // An endless source: only a lazy implementation can be read from at all.
    const endless = new ReadableStream<string>({
      pull(controller) {
        produced++;
        controller.enqueue(`x${produced}`);
      },
    });

    const stream = concatStreams(fromArray(['a', 'b']), endless);
    const reader = stream.getReader();
    const seen: string[] = [];

    for (let i = 0; i < 4; i++) {
      const { value } = await reader.read();
      seen.push(value as string);
    }

    expect(seen).toEqual(['a', 'b', 'x1', 'x2']);
    // The endless source was not drained past what was asked for.
    expect(produced).toBeLessThan(10);

    await reader.cancel();
  });

  test('propagates an error from a source', async () => {
    const stream = concatStreams(
      fromArray(['a']),
      failingStream(new Error('boom')),
    );

    await expect(collect(stream)).rejects.toThrow('boom');
  });

  test('cancels the queued streams', async () => {
    let cancelled = false;

    const queued = new ReadableStream<string>({
      cancel() {
        cancelled = true;
      },
    });

    const stream = concatStreams(fromArray(['a']), queued);
    const reader = stream.getReader();

    await reader.read();
    await reader.cancel('done');

    expect(cancelled).toBe(true);
  });
});

describe('mergeStreams', () => {
  test('forwards every chunk from every source', async () => {
    const stream = mergeStreams(fromArray(['a', 'b']), fromArray(['c']));
    const chunks = await collect(stream);

    expect(chunks.sort()).toEqual(['a', 'b', 'c']);
  });

  test('preserves order within a single source', async () => {
    const stream = mergeStreams(
      slowStream(['a1', 'a2', 'a3'], 2),
      slowStream(['b1', 'b2', 'b3'], 3),
    );

    const chunks = await collect(stream);

    expect(chunks.filter((c) => c.startsWith('a'))).toEqual(['a1', 'a2', 'a3']);
    expect(chunks.filter((c) => c.startsWith('b'))).toEqual(['b1', 'b2', 'b3']);
  });

  test('does not let a slow source hold up a fast one', async () => {
    const stream = mergeStreams(
      slowStream(['slow'], 30),
      slowStream(['fast'], 1),
    );

    const chunks = await collect(stream);

    expect(chunks[0]).toBe('fast');
    expect(chunks[1]).toBe('slow');
  });

  test('handles no streams at all', async () => {
    expect(await collect(mergeStreams())).toEqual([]);
  });

  test('handles empty sources', async () => {
    const stream = mergeStreams(fromArray([]), fromArray(['a']), fromArray([]));
    expect(await collect(stream)).toEqual(['a']);
  });

  test('closes only once every source has closed', async () => {
    const stream = mergeStreams(
      slowStream(['a'], 1),
      slowStream(['b', 'c'], 2),
    );

    expect((await collect(stream)).length).toBe(3);
  });

  test('propagates an error from a source', async () => {
    const stream = mergeStreams(
      fromArray(['a']),
      failingStream(new Error('boom')),
    );

    await expect(collect(stream)).rejects.toThrow('boom');
  });
});

describe('streamToIter', () => {
  test('yields every chunk in order', async () => {
    const seen: string[] = [];

    for await (const chunk of streamToIter(fromArray(['a', 'b', 'c']))) {
      seen.push(chunk);
    }

    expect(seen).toEqual(['a', 'b', 'c']);
  });

  test('yields nothing for an empty stream', async () => {
    expect(await toArrayIterAsync(streamToIter(fromArray([])))).toEqual([]);
  });

  test('feeds the async iter operators', async () => {
    const stream = fromArray([1, 2, 3, 4, 5]);
    const evens = filterIterAsync(streamToIter(stream), (n) => n % 2 === 0);

    expect(await toArrayIterAsync(mapIterAsync(evens, (n) => n * 10))).toEqual([
      20, 40,
    ]);
  });

  test('pulls lazily, one chunk at a time', async () => {
    let produced = 0;

    const endless = new ReadableStream<number>({
      pull(controller) {
        controller.enqueue(produced++);
      },
    });

    expect(
      await toArrayIterAsync(takeIterAsync(streamToIter(endless), 3)),
    ).toEqual([0, 1, 2]);
    // A ReadableStream may fill its queue ahead of demand, but not without end.
    expect(produced).toBeLessThan(10);
  });

  test('cancels the stream when the loop exits early', async () => {
    let cancelled = false;

    const stream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue('a');
        controller.enqueue('b');
      },
      cancel() {
        cancelled = true;
      },
    });

    for await (const chunk of streamToIter(stream)) {
      expect(chunk).toBe('a');
      break;
    }

    expect(cancelled).toBe(true);
    expect(stream.locked).toBe(false);
  });

  test('leaves the stream open under preventCancel', async () => {
    let cancelled = false;

    const stream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue('a');
        controller.enqueue('b');
        controller.close();
      },
      cancel() {
        cancelled = true;
      },
    });

    for await (const chunk of streamToIter(stream, { preventCancel: true })) {
      expect(chunk).toBe('a');
      break;
    }

    expect(cancelled).toBe(false);
    // The lock is released either way, so the rest is still readable.
    expect(stream.locked).toBe(false);
    expect(await collect(stream)).toEqual(['b']);
  });

  test('releases the lock once drained', async () => {
    const stream = fromArray(['a']);

    expect(await toArrayIterAsync(streamToIter(stream))).toEqual(['a']);
    expect(stream.locked).toBe(false);
  });

  test('propagates a stream error', async () => {
    const iter = streamToIter(failingStream(new Error('boom')));

    await expect(toArrayIterAsync(iter)).rejects.toThrow('boom');
  });

  test('surfaces the stream error, not a failure from the underlying cancel', async () => {
    // An errored stream is not cancelled on the way out, so a source whose
    // `cancel` throws cannot contribute an error of its own.
    const stream = new ReadableStream<string>({
      start(controller) {
        controller.error(new Error('boom'));
      },
      cancel() {
        throw new Error('cancel failed');
      },
    });

    await expect(toArrayIterAsync(streamToIter(stream))).rejects.toThrow(
      'boom',
    );
  });

  test('cancels when the body throws', async () => {
    let cancelled = false;

    const stream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue('a');
      },
      cancel() {
        cancelled = true;
      },
    });

    await expect(
      (async () => {
        for await (const _ of streamToIter(stream)) {
          throw new Error('caller failed');
        }
      })(),
    ).rejects.toThrow('caller failed');

    expect(cancelled).toBe(true);
  });
});

describe('iterToStream', () => {
  test('streams a sync iterable', async () => {
    expect(await collect(iterToStream(['a', 'b', 'c']))).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  test('streams an async iterable', async () => {
    async function* source() {
      yield 1;
      yield 2;
    }

    expect(await collect(iterToStream(source()))).toEqual([1, 2]);
  });

  test('streams an iterator-like object', async () => {
    let n = 0;
    const iterator = {
      next: () =>
        n < 2 ? { value: n++, done: false } : { value: undefined, done: true },
    };

    expect(await collect(iterToStream(iterator))).toEqual([0, 1]);
  });

  test('handles an empty source', async () => {
    expect(await collect(iterToStream([]))).toEqual([]);
  });

  test('throws on a non-iterable, at the call', () => {
    expect(() => iterToStream(42 as never)).toThrow(TypeError);
  });

  test('pulls lazily, so an infinite source is safe', async () => {
    let produced = 0;

    function* endless() {
      while (true) {
        produced++;
        yield produced;
      }
    }

    const reader = iterToStream(endless()).getReader();
    const seen: number[] = [];

    for (let i = 0; i < 3; i++) {
      const { value } = await reader.read();
      seen.push(value as number);
    }

    expect(seen).toEqual([1, 2, 3]);
    expect(produced).toBeLessThan(20);

    await reader.cancel();
  });

  test('runs the source finally block on cancel', async () => {
    let closed = false;

    function* source() {
      try {
        yield 'a';
        yield 'b';
      } finally {
        closed = true;
      }
    }

    const reader = iterToStream(source()).getReader();

    await reader.read();
    await reader.cancel();

    expect(closed).toBe(true);
  });

  test('errors the stream when the source throws', async () => {
    function* source(): Generator<string> {
      yield 'a';
      throw new Error('boom');
    }

    await expect(collect(iterToStream(source()))).rejects.toThrow('boom');
  });

  test('round trips through streamToIter', async () => {
    const original = ['a', 'b', 'c'];
    const stream = iterToStream(streamToIter(iterToStream(original)));

    expect(await collect(stream)).toEqual(original);
  });
});
