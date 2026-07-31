import { limitRun, withResolvers } from '../../src';

describe('limitRun', () => {
  test('runs a task and resolves with its result', async () => {
    const limit = limitRun(1);

    expect(await limit(() => 1)).toBe(1);
    expect(await limit(async () => 'a')).toBe('a');
  });

  test('never runs more than the limit at once', async () => {
    const limit = limitRun(2);
    let running = 0;
    let peak = 0;
    const gates = Array.from({ length: 6 }, () => withResolvers<void>());

    const tasks = gates.map((gate, i) =>
      limit(async () => {
        running++;
        peak = Math.max(peak, running);
        await gate.promise;
        running--;
        return i;
      }),
    );

    // Let everything that can start, start.
    await Promise.resolve();
    expect(running).toBe(2);

    for (const gate of gates) {
      gate.resolve();
      await Promise.resolve();
      await Promise.resolve();
    }

    expect(await Promise.all(tasks)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(peak).toBe(2);
  });

  test('starts tasks in the order they were submitted', async () => {
    const limit = limitRun(1);
    const started: number[] = [];
    const gate = withResolvers<void>();

    const tasks = [0, 1, 2, 3].map((i) =>
      limit(async () => {
        started.push(i);
        await gate.promise;
      }),
    );

    gate.resolve();
    await Promise.all(tasks);

    expect(started).toEqual([0, 1, 2, 3]);
  });

  test('starts a task in the same tick when a slot is free', () => {
    const limit = limitRun(1);
    let started = false;

    limit(() => {
      started = true;
    });

    // No turn of the event loop is spent getting to a free slot.
    expect(started).toBe(true);
  });

  test('reports how many are active and pending', async () => {
    const limit = limitRun(2);
    const gate = withResolvers<void>();

    expect(limit.active).toBe(0);
    expect(limit.pending).toBe(0);
    expect(limit.concurrency).toBe(2);

    const tasks = [0, 1, 2, 3, 4].map(() => limit(() => gate.promise));

    expect(limit.active).toBe(2);
    expect(limit.pending).toBe(3);

    gate.resolve();
    await Promise.all(tasks);

    expect(limit.active).toBe(0);
    expect(limit.pending).toBe(0);
  });

  test('releases the slot when a task throws', async () => {
    const limit = limitRun(1);
    const order: string[] = [];

    const failing = limit(async () => {
      order.push('failing');
      throw new Error('boom');
    });

    await expect(failing).rejects.toThrow('boom');

    await limit(async () => {
      order.push('after');
    });

    expect(order).toEqual(['failing', 'after']);
    expect(limit.active).toBe(0);
  });

  test('a rejecting task does not affect the others', async () => {
    const limit = limitRun(2);
    const results = await Promise.allSettled([
      limit(async () => 'a'),
      limit(async () => {
        throw new Error('boom');
      }),
      limit(async () => 'c'),
    ]);

    expect(results.map((r) => r.status)).toEqual([
      'fulfilled',
      'rejected',
      'fulfilled',
    ]);
    expect(limit.active).toBe(0);
  });

  test('releases the slot when a task throws synchronously', async () => {
    const limit = limitRun(1);

    await expect(
      limit(() => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    expect(limit.active).toBe(0);
    expect(await limit(() => 'next')).toBe('next');
  });

  test('does not let a late arrival jump the queue', async () => {
    const limit = limitRun(1);
    const started: string[] = [];
    const gate = withResolvers<void>();

    const first = limit(async () => {
      started.push('first');
      await gate.promise;
    });
    const second = limit(async () => {
      started.push('second');
    });

    // Submitted while `first` still holds the only slot.
    const third = limit(async () => {
      started.push('third');
    });

    gate.resolve();
    await Promise.all([first, second, third]);

    expect(started).toEqual(['first', 'second', 'third']);
  });

  test('defaults to one at a time', async () => {
    const limit = limitRun();
    let running = 0;
    let peak = 0;

    await Promise.all(
      [0, 1, 2].map(() =>
        limit(async () => {
          running++;
          peak = Math.max(peak, running);
          await Promise.resolve();
          running--;
        }),
      ),
    );

    expect(peak).toBe(1);
    expect(limit.concurrency).toBe(1);
  });

  test('allows an unlimited gate', async () => {
    const limit = limitRun(Number.POSITIVE_INFINITY);
    const gate = withResolvers<void>();
    const tasks = [0, 1, 2, 3].map(() => limit(() => gate.promise));

    expect(limit.active).toBe(4);
    expect(limit.pending).toBe(0);

    gate.resolve();
    await Promise.all(tasks);
  });

  test('rejects an invalid concurrency', () => {
    expect(() => limitRun(0)).toThrow(RangeError);
    expect(() => limitRun(-1)).toThrow(RangeError);
    expect(() => limitRun(1.5)).toThrow(RangeError);
    expect(() => limitRun(Number.NaN)).toThrow(RangeError);
  });

  test('shares one budget across unrelated operations', async () => {
    const limit = limitRun(1);
    let running = 0;
    let peak = 0;

    const track = async <T>(value: T) => {
      running++;
      peak = Math.max(peak, running);
      await Promise.resolve();
      running--;
      return value;
    };

    const [a, b] = await Promise.all([
      limit(() => track('query')),
      limit(() => track(42)),
    ]);

    expect([a, b]).toEqual(['query', 42]);
    expect(peak).toBe(1);
  });
});

describe('limitRun > the slot is handed over, not released and retaken', () => {
  /**
   * Submits a task from a microtask `depth` ticks deep, so that one of the runs
   * lands in the window between a finishing task giving up its slot and the
   * queued task taking it. A gate that decrements and lets the next caller
   * increment has a gap there: a task arriving inside it sees a free slot that
   * is already spoken for, starts out of turn, and puts the gate over its limit.
   */
  async function scenario(depth: number) {
    const limit = limitRun(1);
    const started: string[] = [];
    const gate = withResolvers<void>();
    let peak = 0;
    let running = 0;

    const task = (name: string) => async () => {
      started.push(name);
      running++;
      peak = Math.max(peak, running);
      await Promise.resolve();
      running--;
    };

    const first = limit(async () => {
      started.push('first');
      running++;
      peak = Math.max(peak, running);
      await gate.promise;
      running--;
    });
    const queued = limit(task('queued'));

    gate.resolve();

    let tick = Promise.resolve();
    for (let i = 0; i < depth; i++) {
      tick = tick.then(() => {});
    }
    const late = tick.then(() => limit(task('late')));

    await Promise.all([first, queued, late]);

    return { started, peak };
  }

  test('holds the limit and the order whenever the task arrives', async () => {
    for (let depth = 0; depth <= 6; depth++) {
      const { started, peak } = await scenario(depth);

      expect(peak).toBe(1);
      expect(started).toEqual(['first', 'queued', 'late']);
    }
  });
});
