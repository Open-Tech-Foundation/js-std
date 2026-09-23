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

import { seededRandom } from '../../src';

describe('Crypto > seededRandom', () => {
  test('replays the same sequence for equal seeds', () => {
    const a = seededRandom('demo');
    const b = seededRandom('demo');
    const values = Array.from({ length: 1000 }, () => a());
    expect(values).toEqual(Array.from({ length: 1000 }, () => b()));
  });

  test('pins the stream against the reference vectors', () => {
    const rand = seededRandom('demo');
    expect(rand()).toBe(0.8388890530914068);
    expect(rand()).toBe(0.13535357755608857);
    expect(rand()).toBe(0.055482710245996714);
  });

  test('separates number and string seeds', () => {
    expect(seededRandom(1)()).not.toBe(seededRandom(2)());
    expect(seededRandom('a')()).not.toBe(seededRandom('b')());
  });

  test('stays within [0, 1) across many draws', () => {
    const rand = seededRandom(42);
    let hitLow = false;
    let hitHigh = false;
    for (let i = 0; i < 10000; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      if (v < 0.25) hitLow = true;
      if (v >= 0.75) hitHigh = true;
    }
    expect(hitLow).toBe(true);
    expect(hitHigh).toBe(true);
  });

  test('rejects non-seed inputs with TypeError', () => {
    for (const input of [null, undefined, true, {}, []] as never[]) {
      expect(() => seededRandom(input)).toThrow(TypeError);
    }
  });
});
