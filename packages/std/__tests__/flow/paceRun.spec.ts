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

import { paceRun } from '../../src';

describe('paceRun', () => {
  beforeEach(() => {
    clock.freeze();
  });

  afterEach(() => {
    clock.release();
  });

  test('throttles calls', () => {
    const func = mock.fn();
    const throttled = paceRun(func, 100);

    throttled('a');
    throttled('b');
    throttled('c');

    expect(func).toBeCalledWith('a');
    expect(func).toHaveBeenCalledTimes(1);

    clock.advance(100);
    // Trailing is true by default
    expect(func).toBeCalledWith('c');
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('leading: false', () => {
    const func = mock.fn();
    const throttled = paceRun(func, 100, { leading: false });

    throttled('a');
    expect(func).not.toBeCalled();

    clock.advance(100);
    expect(func).toBeCalledWith('a');
  });

  test('trailing: false', () => {
    const func = mock.fn();
    const throttled = paceRun(func, 100, { trailing: false });

    throttled('a');
    throttled('b');
    expect(func).toHaveBeenCalledTimes(1);

    clock.advance(100);
    expect(func).toHaveBeenCalledTimes(1);

    throttled('c');
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toBeCalledWith('c');
  });

  test('cancel method', () => {
    const func = mock.fn();
    const throttled = paceRun(func, 100);

    throttled('a');
    throttled('b');
    throttled.cancel();
    clock.advance(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).not.toBeCalledWith('b');
  });

  test('throws on invalid interval', () => {
    expect(() => paceRun(() => {}, -1)).toThrow(
      'Interval must be greater than or equal to 0.',
    );
    expect(() => paceRun(() => {}, Number.POSITIVE_INFINITY)).toThrow(
      'Interval must be a finite number.',
    );
  });
});
