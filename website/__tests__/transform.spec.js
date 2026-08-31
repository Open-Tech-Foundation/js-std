import transform from '../app/components/runner/transform.js';

/** The runnable source, with the probe table alongside. */
const run = (source) => transform(source);

describe('transform', () => {
  test('reports an annotated expression through a probe', () => {
    const { code, probes } = run('chunk([1, 2], 1) //=> [[1], [2]]');
    expect(code).toBe('__probe(0, (chunk([1, 2], 1))); //=> [[1], [2]]');
    expect(probes).toEqual([
      { id: 0, line: 0, expected: '[[1], [2]]', expr: 'chunk([1, 2], 1)' },
    ]);
  });

  test('leaves an unannotated statement alone', () => {
    const { code, probes } = run('cache.set("a", 1);');
    expect(code).toBe('cache.set("a", 1);');
    expect(probes).toEqual([]);
  });

  test('reports every top-level expression when asked', () => {
    const { probes } = transform('first([1, 2]);', { probeAll: true });
    expect(probes).toHaveLength(1);
  });

  test('comments out an import of the library', () => {
    const { code } = run("import { chunk } from '@opentf/std';\nchunk([1]);");
    expect(code).toBe("// import { chunk } from '@opentf/std';\nchunk([1]);");
  });

  test('leaves an import of anything else in place, to fail loudly', () => {
    const { code } = run("import x from 'elsewhere';");
    expect(code).toBe("import x from 'elsewhere';");
  });

  test('probes a declaration by name, without wrapping it', () => {
    const { code, probes } = run('const r = sum([1, 2]); //=> 3');
    expect(code).toBe('const r = sum([1, 2]); __probe(0, r); //=> 3');
    expect(probes[0].expected).toBe('3');
  });

  test('terminates a declaration that relied on semicolon insertion', () => {
    const { code } = run('const r = [3, 1]\n  .sort() //=> [1, 3]');
    expect(code).toBe(
      'const r = [3, 1]\n  .sort(); __probe(0, r); //=> [1, 3]',
    );
  });

  test('spans a statement across the lines it is written on', () => {
    const source = 'await mapAsync(\n  [1],\n  (n) => n\n); //=> [1]';
    const { code, probes } = run(source);
    expect(code).toBe(
      '__probe(0, (await mapAsync(\n  [1],\n  (n) => n\n))); //=> [1]',
    );
    expect(probes[0].line).toBe(3);
  });

  test('keeps a chained call together across a line break', () => {
    const { code } = run('arr\n  .map(f)\n  .filter(g) //=> []');
    expect(code).toBe('__probe(0, (arr\n  .map(f)\n  .filter(g))); //=> []');
  });

  test('preserves the line count so error lines stay meaningful', () => {
    const source = 'const a = 1;\n\nsum([a]) //=> 1\nboom();';
    expect(run(source).code.split('\n')).toHaveLength(4);
  });

  test('does not wrap several statements sharing one line', () => {
    const { code, probes } = run('a(); b(); //=> 1');
    expect(code).toBe('a(); b(); //=> 1');
    expect(probes).toEqual([]);
  });

  test('skips a block statement, which has no value to report', () => {
    const { probes } = run('if (x) {\n  go();\n} //=> 1');
    expect(probes).toEqual([]);
  });

  test('reads an annotation written without a space', () => {
    expect(run('f()//=>1').probes[0].expected).toBe('1');
  });

  test('ignores a comment that is not an annotation', () => {
    expect(run('cache.get("a"); // most recently used').probes).toEqual([]);
  });
});
