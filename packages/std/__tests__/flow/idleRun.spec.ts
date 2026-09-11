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

import { idleRun } from '../../src';

describe('idleRun', () => {
  beforeEach(() => {
    clock.freeze();
  });

  afterEach(() => {
    clock.release();
  });

  test('debounces calls', () => {
    const func = mock.fn();
    const debounced = idleRun(func, 100);

    debounced('a');
    debounced('b');
    debounced('c');

    expect(func).not.toBeCalled();

    clock.advance(50);
    expect(func).not.toBeCalled();

    clock.advance(50);
    expect(func).toBeCalledWith('c');
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('leading option', () => {
    const func = mock.fn();
    const debounced = idleRun(func, 100, { leading: true });

    debounced('a');
    expect(func).toBeCalledWith('a');

    debounced('b');
    clock.advance(100);
    expect(func).toBeCalledWith('b');
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('maxWait option', () => {
    const func = mock.fn();
    const debounced = idleRun(func, 100, { maxWait: 200 });

    debounced('a');
    clock.advance(50);
    debounced('b');
    clock.advance(50);
    debounced('c');
    clock.advance(50);
    debounced('d');

    // maxWait is 200ms from the first call
    clock.advance(50);
    expect(func).toBeCalledWith('d');
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('cancel method', () => {
    const func = mock.fn();
    const debounced = idleRun(func, 100);

    debounced('a');
    debounced.cancel();
    clock.advance(100);
    expect(func).not.toBeCalled();
  });

  test('flush method', () => {
    const func = mock.fn();
    const debounced = idleRun(func, 100);

    debounced('a');
    debounced.flush();
    expect(func).toBeCalledWith('a');
    expect(debounced.pending()).toBe(false);
  });

  test('throws on invalid timing options', () => {
    expect(() => idleRun(() => {}, -1)).toThrow(
      'Delay must be greater than or equal to 0.',
    );
    expect(() => idleRun(() => {}, Number.NaN)).toThrow(
      'Delay must be a finite number.',
    );
    expect(() => idleRun(() => {}, 0, { maxWait: -1 })).toThrow(
      'maxWait must be greater than or equal to 0.',
    );
  });
});
