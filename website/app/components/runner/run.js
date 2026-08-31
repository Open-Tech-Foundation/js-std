import { isEql } from '@opentf/std';
import * as std from '@opentf/std';
import inspect from './inspect.js';

/**
 * Runs a transformed example and reports what each probe saw.
 *
 * This is the half of the runner that has nothing to do with workers: no
 * `postMessage`, no `self`. Keeping it separate is what lets the same execution
 * semantics — the same scope, the same `//=>` verdicts — be exercised by the
 * test suite in Node, so a green suite says something about what the browser
 * will actually do.
 */

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

/**
 * Every export is bound as a `var`, in one destructuring ahead of the example.
 *
 * `var` on both sides is what makes the two things the samples do legal at
 * once. A page's examples are run together and several restate their setup, so
 * a binding has to be allowed to repeat — `const` would make the second one a
 * syntax error. And two examples deliberately shadow a library name
 * (`const sum = …`, `const chunk = …`), which has to keep working: a `var`
 * redeclaration takes over the name for the rest of the run, where an earlier
 * `with (__std)` wrapper sent the assignment to a read-only namespace property
 * and left the library's own function in place.
 *
 * The preamble shares the first line of the example rather than taking one of
 * its own, so a runtime error's line number still matches the line the reader
 * is looking at.
 */
const BINDINGS = `var {${Object.keys(std).join(',')}} = __std;`;

function compile(code) {
  return new AsyncFunction('__probe', '__std', BINDINGS + code);
}

/**
 * Reads a `//=>` annotation back as a value.
 *
 * Most are plain literals, but some describe a result rather than spell it out
 * — `{ t: DateTime }`, or a quoted string alongside prose. Anything that does
 * not evaluate cleanly leaves the probe unverified: the actual value is still
 * shown, just without a verdict, which is better than claiming a mismatch the
 * reader would have to disprove.
 *
 * Deliberately a plain function rather than an async one, so that `probe` stays
 * synchronous and the results keep their source order.
 */
function readExpected(source) {
  try {
    return new Function('__std', `${BINDINGS}return (${source})`);
  } catch {
    return null;
  }
}

/**
 * Normalises an annotation for the round-trip check.
 *
 * Spacing and quote style vary between pages — `[[1,2],[3]]` and
 * `[[1, 2], [3]]` are the same claim — and neither is what the check is
 * looking for.
 */
function normalise(text) {
  return text.replace(/\s+/g, '').replace(/"/g, "'");
}

/**
 * Decides what a `//=>` annotation says about the value that was produced.
 *
 * An annotation is only treated as a claim when it round-trips: evaluating it
 * and printing the result has to give back the text that was written. Plenty of
 * them describe a result instead of spelling it out — `[2022-01-01, 2023-01-01]`
 * is a readable way to write two dates and also a valid expression that
 * evaluates to `[2020, 2021]` — and comparing against what those happen to mean
 * would mark a correct example wrong. Unverified is the honest answer: the
 * value is shown, and no verdict is claimed.
 */
function verdict(value, source) {
  const expected = readExpected(source);
  if (!expected) return { status: 'unverified' };

  let target;
  try {
    target = expected(std);
  } catch {
    return { status: 'unverified' };
  }

  if (normalise(inspect(target)) !== normalise(source)) {
    return { status: 'unverified' };
  }
  return { status: isEql(value, target) ? 'match' : 'differs' };
}

/**
 * Redirects `console` to the report for the length of a run.
 *
 * The samples print through `console.log`, so capturing it is part of executing
 * one rather than part of hosting the worker — putting it here is what lets the
 * tests see a sample's output.
 */
function captureConsole(report) {
  const levels = ['log', 'info', 'warn', 'error', 'debug'];
  const saved = new Map(levels.map((level) => [level, console[level]]));

  for (const level of levels) {
    console[level] = (...args) => {
      report({
        type: 'log',
        level,
        text: args
          .map((a) => (typeof a === 'string' ? a : inspect(a)))
          .join(' '),
      });
    };
  }

  return () => {
    for (const [level, fn] of saved) console[level] = fn;
  };
}

/**
 * Executes `code`, calling `report` for every probe and for the final outcome.
 *
 * @param {string} code The output of `transform`.
 * @param {Array<{ line: number, expected: string | null }>} probes Its probe
 *   table, indexed by the id baked into the `__probe` calls.
 * @param {(event: object) => void} report Receives `probe`, `error`, and `done`
 *   events in the order they happen.
 */
export default async function run(code, probes, report) {
  const probe = (id, value) => {
    const meta = probes[id];
    let status = 'plain';

    if (meta?.expected != null) status = verdict(value, meta.expected).status;

    report({
      type: 'probe',
      id,
      line: meta?.line ?? 0,
      expected: meta?.expected ?? null,
      actual: inspect(value),
      status,
    });
    return value;
  };

  const started = Date.now();
  const restore = captureConsole(report);
  try {
    await compile(code)(probe, std);
  } catch (error) {
    report({
      type: 'error',
      name: error?.name ?? 'Error',
      message: error?.message ?? String(error),
    });
  } finally {
    restore();
  }
  report({ type: 'done', ms: Date.now() - started });
}
