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

import scan from '../app/components/runner/scan.js';

describe('scan', () => {
  test('reports the bracket depth each line ends at', () => {
    const lines = scan('foo(\n  1,\n);\nbar();');
    expect(lines.map((l) => l.depth)).toEqual([1, 1, 0, 0]);
  });

  test('finds a trailing line comment', () => {
    const [line] = scan('chunk([1, 2], 1) //=> [[1], [2]]');
    expect(line.commentAt).toBe(17);
  });

  test('ignores a comment marker inside a string', () => {
    const [line] = scan("stringReplace('a//b', '/', '-')");
    expect(line.commentAt).toBe(-1);
  });

  test('ignores brackets inside strings and templates', () => {
    const lines = scan("const a = '([{';\nconst b = `${'('}`;");
    expect(lines.map((l) => l.depth)).toEqual([0, 0]);
  });

  test('does not mistake a regex literal for a comment or a division', () => {
    const [line] = scan("stringReplace('abc', /b\\/c/g, 'x') //=> 'ax'");
    expect(line.depth).toBe(0);
    expect(line.text.slice(line.commentAt)).toBe("//=> 'ax'");
  });

  test('divides rather than opening a regex after a value', () => {
    const [line] = scan('const half = (a + b) / 2; //=> 3');
    expect(line.text.slice(line.commentAt)).toBe('//=> 3');
  });

  test('keeps a template literal open across lines', () => {
    const lines = scan('const t = `a\nb`;\nnext();');
    expect(lines.map((l) => l.depth)).toEqual([1, 0, 0]);
  });

  test('blanks strings and comments in the code view, keeping offsets', () => {
    const [line] = scan("f('a;b'); //=> 1");
    expect(line.code).toHaveLength(line.text.length);
    expect(line.code.indexOf(';')).toBe(line.text.indexOf(');') + 1);
  });
});
