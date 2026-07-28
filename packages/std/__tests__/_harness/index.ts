/**
 * Installs the test globals the specs expect.
 *
 * The 146 spec files call `describe`/`test`/`expect`/`vi` as bare globals (the
 * shape `bun test` provides), so this module must be imported before any spec.
 * The bundler guarantees that ordering.
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

const g = globalThis as Record<string, unknown>;

g.describe = describe;
g.test = test;
g.it = it;
g.expect = expect;
g.beforeEach = beforeEach;
g.afterEach = afterEach;
g.beforeAll = beforeAll;
g.afterAll = afterAll;
g.vi = vi;

export { run } from './runner';
export type { Failure, Results } from './runner';
