import '../test.setup.js';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import run from '../app/components/runner/run.js';

/**
 * A worker that runs the code in this thread.
 *
 * The client's job is the wiring around execution — carrying earlier examples
 * in as a prelude, hiding their results, and killing a run that will not stop —
 * and none of that needs a real thread to be exercised. The execution core it
 * posts to is the same module the real worker loads.
 */
class LocalWorker extends EventTarget {
  constructor() {
    super();
    this.alive = true;
  }

  postMessage({ runId, code, probes }) {
    const send = (message) => {
      if (this.alive) {
        this.dispatchEvent(
          Object.assign(new Event('message'), { data: { runId, ...message } }),
        );
      }
    };
    run(code, probes, send);
  }

  terminate() {
    this.alive = false;
  }
}

globalThis.Worker = LocalWorker;

const { default: execute } = await import('../app/components/runner/client.js');

/** Collects everything one run reports. */
async function collect(source, options = {}) {
  const events = [];
  await execute(source, { ...options, onEvent: (e) => events.push(e) });
  return events;
}

const probes = (events) => events.filter((e) => e.type === 'probe');

describe('execute', () => {
  test('reports a result and finishes', async () => {
    const events = await collect('chunk([1, 2], 1) //=> [[1], [2]]');
    expect(probes(events)).toHaveLength(1);
    expect(probes(events)[0].status).toBe('match');
    expect(events.at(-1).type).toBe('done');
  });

  test('carries earlier examples on the page into scope', async () => {
    const events = await collect('first(shared) //=> 1', {
      prelude: 'const shared = [1, 2];',
    });
    expect(probes(events)[0].status).toBe('match');
  });

  test('hides the results of the examples it only carried in', async () => {
    const events = await collect('last(shared) //=> 2', {
      prelude: 'const shared = [1, 2];\nfirst(shared) //=> 1',
    });
    expect(probes(events)).toHaveLength(1);
    expect(probes(events)[0].actual).toBe('2');
  });

  test('anchors a result to the line of the example, not of the prelude', async () => {
    const events = await collect('first([1]) //=> 1\nlast([1, 2]) //=> 2', {
      prelude: 'const a = 1;\nconst b = 2;',
    });
    expect(probes(events).map((p) => p.line)).toEqual([0, 1]);
  });

  test('reports a failure to transform rather than throwing', async () => {
    const events = await collect('`unterminated');
    expect(events.at(-1).type).toBe('done');
  });

  // An example that never returns, written so that it yields: a busy loop
  // would hang this test, which is the whole reason the real runner uses a
  // worker it can terminate.
  test('stops a run that will not end on its own', async () => {
    const events = await collect('await new Promise(() => {});', {
      timeout: 50,
    });
    expect(events.some((e) => e.type === 'timeout')).toBe(true);
  });
});
