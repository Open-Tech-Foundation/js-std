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
      return batch.map(args => args[0] * 2);
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
      return batch.map(args => args[0] * 2);
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
});
