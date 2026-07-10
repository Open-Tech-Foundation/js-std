import { batchRun } from '../../src';

describe('batchRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('batches calls by limit', async () => {
    const processor = vi.fn(async (batch: number[][]) => {
      return batch.map((args) => args[0] * 2);
    });
    const batched = batchRun(processor, { limit: 2 });

    const p1 = batched(1);
    const p2 = batched(2);
    const p3 = batched(3);

    expect(processor).toHaveBeenCalledTimes(1);
    expect(await p1).toBe(2);
    expect(await p2).toBe(4);

    vi.advanceTimersByTime(0);
    expect(processor).toHaveBeenCalledTimes(2);
    expect(await p3).toBe(6);
  });

  test('batches calls by delay', async () => {
    const processor = vi.fn(async (batch: number[][]) => {
      return batch.map((args) => args[0] * 2);
    });
    const batched = batchRun(processor, { delay: 100 });

    const p1 = batched(1);
    const p2 = batched(2);

    expect(processor).not.toBeCalled();

    vi.advanceTimersByTime(100);
    // Use a small delay to allow promises to settle

    expect(processor).toHaveBeenCalledTimes(1);
    expect(await p1).toBe(2);
    expect(await p2).toBe(4);
  });

  test('handles errors', async () => {
    const processor = vi.fn(() => {
      throw new Error('fail');
    });
    const batched = batchRun(processor, { limit: 1 });

    await expect(batched(1)).rejects.toThrow('fail');
  });

  test('rejects when batchProcessor result count mismatches the queue length', async () => {
    const batched = batchRun(async (batch: number[][]) => {
      return batch.slice(0, 1).map((args) => args[0] * 2);
    }, { limit: 2 });

    await expect(Promise.all([batched(1), batched(2)])).rejects.toThrow(
      'batchProcessor must return exactly 2 result(s).',
    );
  });

  test('throws on invalid options', () => {
    expect(() => batchRun(async () => [], { limit: 0 })).toThrow(
      'Limit must be greater than or equal to 1.',
    );
    expect(() => batchRun(async () => [], { limit: 1.5 })).toThrow(
      'Limit must be an integer.',
    );
    expect(() => batchRun(async () => [], { delay: -1 })).toThrow(
      'Delay must be greater than or equal to 0.',
    );
  });
});
