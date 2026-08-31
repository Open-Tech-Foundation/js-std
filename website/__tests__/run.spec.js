import run from '../app/components/runner/run.js';
import transform from '../app/components/runner/transform.js';

/** Runs an example the way the worker does, collecting what it reported. */
async function execute(source) {
  const { code, probes } = transform(source);
  const events = [];
  await run(code, probes, (event) => events.push(event));
  return events;
}

const probes = (events) => events.filter((e) => e.type === 'probe');

describe('run', () => {
  test('binds the library so an example runs as written', async () => {
    const [probe] = probes(
      await execute('chunk([1, 2, 3], 2) //=> [[1, 2], [3]]'),
    );
    expect(probe.actual).toBe('[[1, 2], [3]]');
    expect(probe.status).toBe('match');
  });

  test('marks a wrong annotation as a difference', async () => {
    const [probe] = probes(await execute('chunk([1, 2], 1) //=> [[1, 2]]'));
    expect(probe.status).toBe('differs');
    expect(probe.actual).toBe('[[1], [2]]');
  });

  test('reports an unannotated statement with no verdict', async () => {
    const [probe] = probes(
      await execute('const r = chunk([1], 1); //=> [[1]]'),
    );
    expect(probe.status).toBe('match');
  });

  test('claims no verdict for an annotation that only describes a result', async () => {
    // `[2022-01-01]` is prose that also happens to parse, as 2022 - 1 - 1.
    const events = await execute(
      'const d = [new Date(2022, 0, 1)];\nd //=> [2022-01-01]',
    );
    expect(probes(events).at(-1).status).toBe('unverified');
  });

  test('claims no verdict for an annotation that is not an expression', async () => {
    const [probe] = probes(await execute("first(['a']) //=> 'a' when present"));
    expect(probe.status).toBe('unverified');
  });

  test('lets a local declaration shadow a library name', async () => {
    const [probe] = probes(await execute('const sum = 2;\nsum //=> 2'));
    expect(probe.status).toBe('match');
  });

  test('carries a value from one statement to the next', async () => {
    const events = await execute('const a = [1, 2];\nfirst(a) //=> 1');
    expect(probes(events).at(-1).status).toBe('match');
  });

  test('awaits an asynchronous example before reporting it', async () => {
    const [probe] = probes(
      await execute('await mapAsync([1, 2], async (n) => n * 2) //=> [2, 4]'),
    );
    expect(probe.status).toBe('match');
  });

  test('reports results in the order they were written', async () => {
    const events = await execute('first([1]) //=> 1\nlast([1, 2]) //=> 2');
    expect(probes(events).map((p) => p.line)).toEqual([0, 1]);
  });

  test('reports a thrown error instead of failing the run', async () => {
    const events = await execute('missingHelper() //=> 1');
    const error = events.find((e) => e.type === 'error');
    expect(error.name).toBe('ReferenceError');
    expect(events.at(-1).type).toBe('done');
  });

  test('reports a syntax error the same way', async () => {
    const events = await execute('const = ;');
    expect(events.find((e) => e.type === 'error').name).toBe('SyntaxError');
  });

  test('always finishes with a done event', async () => {
    const events = await execute('chunk([1], 1) //=> [[1]]');
    expect(events.at(-1).type).toBe('done');
    expect(events.at(-1).ms).toBeGreaterThanOrEqual(0);
  });
});
