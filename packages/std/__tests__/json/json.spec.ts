import {
  DateTime,
  Duration,
  isJSONValue,
  tryParseJSON,
  tryStringifyJSON,
} from '../../src';

describe('Json', () => {
  describe('isJSONValue', () => {
    test('primitives', () => {
      expect(isJSONValue(null)).toBe(true);
      expect(isJSONValue('hi')).toBe(true);
      expect(isJSONValue('')).toBe(true);
      expect(isJSONValue(0)).toBe(true);
      expect(isJSONValue(-1.5)).toBe(true);
      expect(isJSONValue(true)).toBe(true);
      expect(isJSONValue(false)).toBe(true);
      expect(isJSONValue(Number.NaN)).toBe(false);
      expect(isJSONValue(Number.POSITIVE_INFINITY)).toBe(false);
      expect(isJSONValue(Number.NEGATIVE_INFINITY)).toBe(false);
      expect(isJSONValue(undefined)).toBe(false);
      expect(isJSONValue(BigInt(1))).toBe(false);
      expect(isJSONValue(Symbol('a'))).toBe(false);
      expect(isJSONValue(() => {})).toBe(false);
    });

    test('arrays', () => {
      expect(isJSONValue([])).toBe(true);
      expect(isJSONValue([1, 'a', null, true])).toBe(true);
      expect(isJSONValue([1, [2, { a: 3 }]])).toBe(true);
      expect(isJSONValue([1, undefined])).toBe(false);
      expect(isJSONValue([1, Number.NaN])).toBe(false);
      expect(isJSONValue([1, BigInt(1)])).toBe(false);
      expect(isJSONValue([1, () => {}])).toBe(false);
    });

    test('objects', () => {
      expect(isJSONValue({})).toBe(true);
      expect(isJSONValue({ a: 1, b: 'x', c: null })).toBe(true);
      expect(isJSONValue({ a: { b: [1, 2] } })).toBe(true);
      expect(isJSONValue(Object.create(null))).toBe(true);
      expect(isJSONValue(Object.assign(Object.create(null), { a: 1 }))).toBe(
        true,
      );
      expect(isJSONValue({ a: undefined })).toBe(false);
      expect(isJSONValue({ a: Number.NaN })).toBe(false);
      expect(isJSONValue({ a: BigInt(1) })).toBe(false);
      expect(isJSONValue({ a: () => {} })).toBe(false);
      expect(isJSONValue({ a: Symbol('x') })).toBe(false);
      expect(isJSONValue(new Date())).toBe(false);
      expect(isJSONValue(new DateTime('2024-01-01'))).toBe(false);
      expect(isJSONValue(new Duration('P1D'))).toBe(false);
      expect(isJSONValue(new Map())).toBe(false);
      expect(isJSONValue(new Set([1]))).toBe(false);
      expect(isJSONValue(Object.create({ a: 1 }))).toBe(false);
    });

    test('symbol keys', () => {
      const o: Record<string | symbol, unknown> = { a: 1 };
      o[Symbol('s')] = 1;
      expect(isJSONValue(o)).toBe(false);
    });

    test('cyclic structures return false instead of throwing', () => {
      const obj: Record<string, unknown> = {};
      obj.self = obj;
      expect(isJSONValue(obj)).toBe(false);

      const arr: unknown[] = [1];
      arr.push(arr);
      expect(isJSONValue(arr)).toBe(false);

      const mixed: Record<string, unknown> = { bad: BigInt(1) };
      mixed.self = mixed;
      expect(isJSONValue(mixed)).toBe(false);
    });

    test('shared (diamond) references are allowed', () => {
      const shared = { x: 1 };
      expect(isJSONValue({ a: shared, b: shared })).toBe(true);
      expect(isJSONValue([shared, shared])).toBe(true);
    });
  });

  describe('tryParseJSON', () => {
    test('valid JSON', () => {
      expect(tryParseJSON('{"a":1}')).toEqual({ a: 1 });
      expect(tryParseJSON('[1,2,3]')).toEqual([1, 2, 3]);
      expect(tryParseJSON('null')).toBe(null);
      expect(tryParseJSON('"hi"')).toBe('hi');
      expect(tryParseJSON('123')).toBe(123);
      expect(tryParseJSON('true')).toBe(true);
    });

    test('invalid returns fallback/undefined', () => {
      expect(tryParseJSON('bad')).toBeUndefined();
      expect(tryParseJSON('bad', { a: 1 })).toEqual({ a: 1 });
      expect(tryParseJSON('{a:1}')).toBeUndefined();
      expect(tryParseJSON('{a:1}', 42)).toBe(42);
      expect(tryParseJSON('', 'fallback')).toBe('fallback');
    });

    test('non-string returns fallback', () => {
      expect(tryParseJSON(123 as unknown as string)).toBeUndefined();
      expect(tryParseJSON(123 as unknown as string, [])).toEqual([]);
      expect(tryParseJSON(null as unknown as string, 'x')).toBe('x');
      expect(tryParseJSON(undefined as unknown as string)).toBeUndefined();
    });

    test('reviver', () => {
      const reviver = (_k: string, v: unknown) =>
        _k === 'a' && typeof v === 'number' ? (v as number) * 2 : v;
      expect(tryParseJSON('{"a":1}', undefined, reviver)).toEqual({ a: 2 });
      expect(tryParseJSON('bad', { a: 1 }, reviver)).toEqual({ a: 1 });
      expect(tryParseJSON('{"a":1}', undefined, { reviver } as never)).toEqual({
        a: 2,
      });
    });

    test('temporal', () => {
      const dt = tryParseJSON<{ t: unknown }>(
        '{"t":"2024-01-01T00:00:00.000Z"}',
        undefined,
        { temporal: true } as never,
      );
      expect(dt?.t).toBeInstanceOf(DateTime);
      expect((dt?.t as DateTime).toISOString()).toContain('2024-01-01');

      const dur = tryParseJSON<{ d: unknown }>('{"d":"P1DT2H"}', undefined, {
        temporal: true,
      } as never);
      expect(dur?.d).toBeInstanceOf(Duration);
      expect((dur?.d as Duration).toString()).toBe('P1DT2H');

      const plain = tryParseJSON('{"a":1}', undefined, {
        temporal: true,
      } as never);
      expect(plain).toEqual({ a: 1 });

      // default is temporal:true, stays DateTime
      const noTemp = tryParseJSON<{ t: unknown }>(
        '{"t":"2024-01-01T00:00:00.000Z"}',
      );
      expect(noTemp?.t).toBeInstanceOf(DateTime);

      // explicit temporal:false stays string
      const disabled = tryParseJSON<{ t: unknown }>(
        '{"t":"2024-01-01T00:00:00.000Z"}',
        undefined,
        { temporal: false } as never,
      );
      expect(typeof disabled?.t).toBe('string');

      // reviver + temporal composes
      const withReviver = tryParseJSON<{ n: number }>('{"n":1}', undefined, {
        temporal: true,
        reviver: (k, v) => (k === 'n' && typeof v === 'number' ? v * 10 : v),
      } as never);
      expect(withReviver).toEqual({ n: 10 });
    });
  });

  describe('tryStringifyJSON', () => {
    test('basic', () => {
      expect(tryStringifyJSON({ a: 1 })).toBe('{"a":1}');
      expect(tryStringifyJSON([1, 2, 3])).toBe('[1,2,3]');
      expect(tryStringifyJSON(null)).toBe('null');
      expect(tryStringifyJSON('hi')).toBe('"hi"');
    });

    test('bigint auto-stringify', () => {
      expect(tryStringifyJSON({ n: BigInt(1) })).toBe('{"n":"1"}');
      expect(tryStringifyJSON({ a: BigInt('9007199254740993') })).toBe(
        '{"a":"9007199254740993"}',
      );
      expect(tryStringifyJSON([BigInt(1), BigInt(2)])).toBe('["1","2"]');
      expect(tryStringifyJSON({ a: { b: BigInt(42) } })).toBe(
        '{"a":{"b":"42"}}',
      );
      // top-level bigint → string
      expect(tryStringifyJSON(BigInt(123))).toBe('"123"');
    });

    test('bigint with replacer function', () => {
      const replacer = (_k: string, v: unknown) =>
        typeof v === 'string' ? (v as string).toUpperCase() : v;
      // bigint → "1" then replacer uppercases → not affected (already stringified before)
      expect(tryStringifyJSON({ n: BigInt(1) }, undefined, { replacer })).toBe(
        '{"n":"1"}',
      );
      expect(
        tryStringifyJSON({ a: 1, b: 2 }, undefined, {
          replacer: (k: string, v: unknown) => (k === 'a' ? undefined : v),
        }),
      ).toBe('{"b":2}');
    });

    test('bigint with replacer array', () => {
      expect(
        tryStringifyJSON({ a: 1, b: BigInt(2), c: 3 }, undefined, {
          replacer: ['a', 'b'],
        }),
      ).toBe('{"a":1,"b":"2"}');
    });

    test('space option', () => {
      expect(tryStringifyJSON({ a: 1 }, undefined, { space: 2 })).toBe(
        '{\n  "a": 1\n}',
      );
    });

    test('circular returns fallback', () => {
      const o: Record<string, unknown> = {};
      o.self = o;
      expect(tryStringifyJSON(o)).toBeUndefined();
      expect(tryStringifyJSON(o, '{}')).toBe('{}');
    });

    test('top-level undefined/function/symbol returns fallback', () => {
      expect(tryStringifyJSON(undefined)).toBeUndefined();
      expect(tryStringifyJSON(undefined, 'fallback')).toBe('fallback');
      expect(tryStringifyJSON(() => {})).toBeUndefined();
      expect(tryStringifyJSON(Symbol('a'), 'x')).toBe('x');
    });

    test('undefined in object/array follows native', () => {
      // native: undefined in object omitted, in array → null
      expect(tryStringifyJSON({ a: 1, b: undefined })).toBe('{"a":1}');
      expect(tryStringifyJSON([1, undefined, 3])).toBe('[1,null,3]');
    });

    test('temporal', () => {
      const dt = new DateTime('2024-01-01T00:00:00.000Z');
      expect(tryStringifyJSON({ t: dt })).toBe(`{"t":"${dt.toISOString()}"}`);
      expect(tryStringifyJSON({ t: dt }, undefined, { temporal: true })).toBe(
        `{"t":"${dt.toISOString()}"}`,
      );
      expect(tryStringifyJSON({ t: dt }, undefined, { temporal: false })).toBe(
        `{"t":"${dt.toISOString()}"}`,
      ); // DateTime has toJSON, works even without flag

      const dur = new Duration('P1DT2H');
      expect(tryStringifyJSON({ d: dur }, undefined, { temporal: true })).toBe(
        '{"d":"P1DT2H"}',
      );

      // bigint + temporal together (temporal default true)
      expect(tryStringifyJSON({ n: BigInt(1), t: dt })).toBe(
        `{"n":"1","t":"${dt.toISOString()}"}`,
      );

      // replacer still called after temporal conversion
      expect(
        tryStringifyJSON({ t: dt }, undefined, {
          replacer: (k, v) => (k === 't' ? 'x' : v),
        }),
      ).toBe('{"t":"x"}');

      // array replacer with temporal (default)
      expect(
        tryStringifyJSON({ a: 1, t: dt }, undefined, {
          replacer: ['a'],
        }),
      ).toBe('{"a":1}');
    });
  });
});
