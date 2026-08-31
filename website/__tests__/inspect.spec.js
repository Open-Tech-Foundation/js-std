import inspect from '../app/components/runner/inspect.js';

describe('inspect', () => {
  test('writes arrays and objects the way the docs do', () => {
    expect(
      inspect([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ).toBe("[['a', 'b'], ['c', 'd']]");
    expect(inspect({ a: 1, b: [1, 2] })).toBe('{ a: 1, b: [1, 2] }');
    expect(inspect([])).toBe('[]');
    expect(inspect({})).toBe('{}');
  });

  test('quotes a key only when it needs quoting', () => {
    expect(inspect({ 'a-b': 1, c: 2 })).toBe("{ 'a-b': 1, c: 2 }");
  });

  test('escapes control characters in a string', () => {
    expect(inspect('a\nb')).toBe("'a\\nb'");
    expect(inspect("it's")).toBe("'it\\'s'");
  });

  test('keeps the values the library distinguishes but String() does not', () => {
    expect(inspect(-0)).toBe('-0');
    expect(inspect(0)).toBe('0');
    expect(inspect(10n)).toBe('10n');
    expect(inspect(Number.NaN)).toBe('NaN');
  });

  test('names collections by size', () => {
    expect(inspect(new Map([['a', 1]]))).toBe("Map(1) { 'a' => 1 }");
    expect(inspect(new Set([1, 2]))).toBe('Set(2) { 1, 2 }');
    expect(inspect(new Map())).toBe('Map(0) {}');
    expect(inspect(new Uint8Array([1, 2]))).toBe('Uint8Array(2) [1, 2]');
  });

  test('names the constructor of an instance', () => {
    class Box {
      constructor(value) {
        this.value = value;
      }
    }
    expect(inspect(new Box(1))).toBe('Box { value: 1 }');
  });

  test('breaks a cycle instead of recursing', () => {
    const o = { a: 1 };
    o.self = o;
    expect(inspect(o)).toBe('{ a: 1, self: [Circular] }');
  });

  test('shows the same value twice when it is not a cycle', () => {
    const shared = { a: 1 };
    expect(inspect([shared, shared])).toBe('[{ a: 1 }, { a: 1 }]');
  });

  test('labels what cannot be spelled out', () => {
    expect(inspect(() => {})).toBe('[Function: (anonymous)]');
    expect(inspect(function named() {})).toBe('[Function: named]');
    expect(inspect(class A {})).toBe('[class A]');
    expect(inspect(Symbol('s'))).toBe('Symbol(s)');
    expect(inspect(Promise.resolve())).toBe('Promise { <pending> }');
  });

  test('renders dates, patterns, and errors readably', () => {
    expect(inspect(new Date('2024-01-01'))).toBe('2024-01-01T00:00:00.000Z');
    expect(inspect(new Date('x'))).toBe('Invalid Date');
    expect(inspect(/ab+/g)).toBe('/ab+/g');
    expect(inspect(new TypeError('bad'))).toBe('TypeError: bad');
  });

  test('stops at a depth rather than printing a whole graph', () => {
    const deep = { a: { b: { c: { d: { e: { f: 1 } } } } } };
    expect(inspect(deep)).toContain('[Object]');
  });
});
