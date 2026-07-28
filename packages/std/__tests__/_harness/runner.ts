/**
 * A minimal describe/test runner that works on any ES2022 runtime.
 *
 * Two phases: importing the spec files builds a suite tree, then `run()` walks
 * it. Nothing is swallowed — every thrown error lands in the results, including
 * errors thrown by a `describe` body itself.
 */

type Hook = () => unknown | Promise<unknown>;
type TestFn = () => unknown | Promise<unknown>;

interface Suite {
  name: string;
  parent: Suite | undefined;
  beforeAll: Hook[];
  afterAll: Hook[];
  beforeEach: Hook[];
  afterEach: Hook[];
  children: Array<Suite | TestCase>;
}

interface TestCase {
  name: string;
  fn: TestFn | undefined;
  isTest: true;
}

export interface Failure {
  title: string;
  message: string;
  stack?: string;
}

export interface Results {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  failures: Failure[];
  durationMs: number;
}

/**
 * Captured before any fake-timer install, so test timeouts and the duration
 * reading survive `vi.useFakeTimers()` — including a test that forgets to restore.
 */
const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
const realDateNow = Date.now.bind(Date);

const root: Suite = {
  name: '',
  parent: undefined,
  beforeAll: [],
  afterAll: [],
  beforeEach: [],
  afterEach: [],
  children: [],
};

let current: Suite = root;
const collectionErrors: Failure[] = [];

function titleOf(suite: Suite, name: string): string {
  const parts: string[] = [name];
  for (let s: Suite | undefined = suite; s?.name; s = s.parent)
    parts.unshift(s.name);
  return parts.join(' > ');
}

export function describe(name: string, fn: () => void): void {
  const suite: Suite = {
    name,
    parent: current,
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
    children: [],
  };
  current.children.push(suite);
  const prev = current;
  current = suite;
  try {
    fn();
  } catch (err) {
    // A describe body that throws would otherwise silently drop every test inside it.
    collectionErrors.push({
      title: titleOf(prev, name),
      message: `describe body threw: ${(err as Error)?.message ?? String(err)}`,
      stack: (err as Error)?.stack,
    });
  } finally {
    current = prev;
  }
}

export function test(name: string, fn?: TestFn): void {
  current.children.push({ name, fn, isTest: true });
}

export const it = test;

export const beforeEach = (fn: Hook) => void current.beforeEach.push(fn);
export const afterEach = (fn: Hook) => void current.afterEach.push(fn);
export const beforeAll = (fn: Hook) => void current.beforeAll.push(fn);
export const afterAll = (fn: Hook) => void current.afterAll.push(fn);

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    p,
    new Promise<never>((_, reject) => {
      timer = realSetTimeout(
        () => reject(new Error(`Timed out after ${ms}ms: ${label}`)),
        ms,
      );
    }),
  ]).finally(() => realClearTimeout(timer)) as Promise<T>;
}

function collectEachHooks(suite: Suite): { before: Hook[]; after: Hook[] } {
  const chain: Suite[] = [];
  for (let s: Suite | undefined = suite; s; s = s.parent) chain.unshift(s);
  return {
    before: chain.flatMap((s) => s.beforeEach),
    // afterEach runs innermost-first, mirroring Jest/Vitest.
    after: chain.flatMap((s) => s.afterEach).reverse(),
  };
}

export async function run(timeoutMs = 10_000): Promise<Results> {
  const started = realDateNow();
  const results: Results = {
    passed: 0,
    failed: collectionErrors.length,
    skipped: 0,
    total: 0,
    failures: [...collectionErrors],
    durationMs: 0,
  };

  async function walk(suite: Suite): Promise<void> {
    for (const hook of suite.beforeAll) {
      try {
        await hook();
      } catch (err) {
        results.failed++;
        results.failures.push({
          title: titleOf(suite.parent ?? root, suite.name),
          message: `beforeAll threw: ${(err as Error)?.message ?? String(err)}`,
          stack: (err as Error)?.stack,
        });
      }
    }

    for (const child of suite.children) {
      if ('isTest' in child) {
        results.total++;
        const title = titleOf(suite, child.name);

        if (!child.fn) {
          results.skipped++;
          continue;
        }

        const { before, after } = collectEachHooks(suite);
        try {
          await withTimeout(
            (async () => {
              for (const h of before) await h();
              try {
                await child.fn!();
              } finally {
                for (const h of after) await h();
              }
            })(),
            timeoutMs,
            title,
          );
          results.passed++;
        } catch (err) {
          results.failed++;
          results.failures.push({
            title,
            message: (err as Error)?.message ?? String(err),
            stack: (err as Error)?.stack,
          });
        }
      } else {
        await walk(child);
      }
    }

    for (const hook of suite.afterAll) {
      try {
        await hook();
      } catch (err) {
        results.failed++;
        results.failures.push({
          title: titleOf(suite.parent ?? root, suite.name),
          message: `afterAll threw: ${(err as Error)?.message ?? String(err)}`,
          stack: (err as Error)?.stack,
        });
      }
    }
  }

  await walk(root);
  results.durationMs = realDateNow() - started;
  return results;
}
