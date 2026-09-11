/**
 * Installs the test globals the specs expect.
 *
 * The runtime matrix aliases `runtime:test` to this module. It preserves the
 * test API that the specs import while the matrix bundle runs without esdev.
 */
import { expect } from './expect';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  test,
} from './runner';
import { vi } from './timers';

export const mock = {
  fn: vi.fn,
  spyOn: vi.spyOn,
};

export const clock = {
  freeze: vi.useFakeTimers,
  release: vi.useRealTimers,
  advance: vi.advanceTimersByTime,
  advanceAsync: vi.advanceTimersByTimeAsync,
};

export { run } from './runner';
export type { Failure, Results } from './runner';
export {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
};
