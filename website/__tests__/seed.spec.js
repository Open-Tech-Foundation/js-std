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

import seed, { seedFromExample } from '../app/components/runner/seed.js';

describe('seedFromExample', () => {
  test('prints the value of an annotated expression', () => {
    expect(seedFromExample('chunk([1, 2], 1) //=> [[1], [2]]')).toBe(
      'console.log(chunk([1, 2], 1)); //=> [[1], [2]]',
    );
  });

  test('keeps the documented result beside the call', () => {
    expect(seedFromExample('first([1]) //=> 1')).toContain('//=> 1');
  });

  test('leaves setup alone, since the sample needs it', () => {
    const source = 'const items = [1, 2];\nfirst(items) //=> 1';
    expect(seedFromExample(source)).toBe(
      'const items = [1, 2];\nconsole.log(first(items)); //=> 1',
    );
  });

  test('leaves an unannotated call alone', () => {
    expect(seedFromExample('cache.set("a", 1);')).toBe('cache.set("a", 1);');
  });

  test('keeps the import a reader would write themselves', () => {
    const source = "import { first } from '@opentf/std';\nfirst([1]) //=> 1";
    expect(seedFromExample(source)).toBe(
      "import { first } from '@opentf/std';\nconsole.log(first([1])); //=> 1",
    );
  });

  test('wraps a call written across several lines', () => {
    const source = 'await mapAsync(\n  [1],\n  (n) => n\n); //=> [1]';
    expect(seedFromExample(source)).toBe(
      'console.log(await mapAsync(\n  [1],\n  (n) => n\n)); //=> [1]',
    );
  });

  test('does not print a declaration, which has no value to show', () => {
    const source = 'const r = sum([1, 2]); //=> 3';
    expect(seedFromExample(source)).toBe(source);
  });

  // The semicolon inside the callback ends nothing; the statement is one call.
  test('prints a call whose callback body has statements of its own', () => {
    const source =
      'await mapAsync(items, async (n) => {\n  return n * 2;\n}); //=> [2, 4]';
    expect(seedFromExample(source)).toBe(
      'console.log(await mapAsync(items, async (n) => {\n  return n * 2;\n})); //=> [2, 4]',
    );
  });

  test('leaves several statements sharing a line alone', () => {
    expect(seedFromExample('a(); b(); //=> 1')).toBe('a(); b(); //=> 1');
  });
});

describe('seed', () => {
  test('joins a page into one sample under its import', () => {
    const sample = seed(['first([1]) //=> 1', 'last([1, 2]) //=> 2'], {
      header: "import { first, last } from '@opentf/std';",
    });
    expect(sample).toBe(
      "import { first, last } from '@opentf/std';\n\n" +
        'console.log(first([1])); //=> 1\n\n' +
        'console.log(last([1, 2])); //=> 2\n',
    );
  });

  test('drops an empty block', () => {
    expect(seed(['first([1]) //=> 1', '   '])).toBe(
      'console.log(first([1])); //=> 1\n',
    );
  });

  test('works without an import to lead with', () => {
    expect(seed(['first([1]) //=> 1'])).toBe(
      'console.log(first([1])); //=> 1\n',
    );
  });
});
