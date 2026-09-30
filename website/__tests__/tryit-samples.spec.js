import { describe, expect, test } from 'runtime:test';

import { Glob, file } from 'runtime:fs';
import { dirname, fromFileURL, join } from 'runtime:path';
import * as std from '@opentf/std';
import inspect from '../app/components/runner/inspect.js';
import run from '../app/components/runner/run.js';
import transform from '../app/components/runner/transform.js';

/**
 * Every page's Try-it sample runs through the same pipeline the browser
 * uses — `transform` with probing off, then `run` — and must execute
 * without errors and print something. A sample that needs setup from the
 * page's prose fails here exactly as it would for a reader pressing Run,
 * so keep each `tryItCode` small and self-contained.
 *
 * On top of that, every `//=>` beside a `console.log` is checked against
 * what was actually printed, so a sample that runs yet shows a stale
 * result (the options migration left eighteen of those) fails here too.
 * An annotation only counts as a claim when it round-trips — evaluating
 * it and printing the result must give back the text that was written —
 * so prose (`(capped at array length)`) and descriptions (`Logs 1, 2, 3`)
 * stay unverified rather than failing. Samples whose output is
 * nondeterministic by design live in NONDETERMINISTIC below instead.
 */

const normalise = (text) => text.replace(/\s+/g, '').replace(/"/g, "'");

// Sample output that cannot be asserted exactly: random values, fresh ids
// and timestamps.
const NONDETERMINISTIC = new Map([
  ['app/docs/Crypto/randomFloat/page.mdx', 'random output'],
  ['app/docs/Crypto/randomId/page.mdx', 'random output'],
  ['app/docs/Crypto/randomInt/page.mdx', 'random output'],
  ['app/docs/Crypto/randomString/page.mdx', 'random output'],
  ['app/docs/Crypto/ulid/page.mdx', 'fresh id and timestamp'],
  ['app/docs/Crypto/ulidTime/page.mdx', 'fresh timestamp'],
  ['app/docs/Crypto/uuidv4/page.mdx', 'fresh id'],
  ['app/docs/Crypto/uuidv7Time/page.mdx', 'fresh timestamp'],
]);

const BINDINGS = `var {${Object.keys(std).join(',')}} = __std;`;

function readExpected(source) {
  try {
    return new Function('__std', `${BINDINGS}return (${source})`);
  } catch {
    return null;
  }
}

const printed = (value) => (typeof value === 'string' ? value : inspect(value));

/**
 * Reads the claim for one printed line: the `//=>` on its own line, or a
 * `//=>` block on the lines right below it (long outputs wrap that way).
 * One trailing prose suffix (`(capped at array length)`) is stripped, but
 * a suffix that marks the output as nondeterministic (`(random result)`)
 * keeps the whole line unverified. Returns null when there is no claim.
 */
function claimFor(lines, at) {
  const atIdx = lines[at].indexOf('//=>');
  if (atIdx !== -1) {
    const direct = lines[at].slice(atIdx + 4).trim();
    if (direct !== '') return stripProse(direct);
  }
  const block = [];
  for (let j = at + 1; j < lines.length; j++) {
    const trimmed = lines[j].trim();
    if (!trimmed.startsWith('//')) break;
    block.push(trimmed.replace(/^\/\/\s?/, ''));
  }
  if (block.length === 0 || !block[0].startsWith('=>')) return null;
  return block.join('\n').replace(/^=>\s?/, '');
}

/** Drops a trailing `(prose)` suffix unless it marks random output. */
function stripProse(annotation) {
  const match = /^(.*?)\s*\((.*)\)\s*$/.exec(annotation);
  if (match && !/random|e\.g\.|moment|ordered/i.test(match[2])) {
    return match[1].trim() || null;
  }
  return annotation;
}

/**
 * Pairs each printed line with the `//=>` beside the `console.log` that
 * made it, and reports the ones whose claim round-trips yet differs —
 * the shape of every stale sample the options migration left behind.
 */
function checkLogs(code, logs) {
  const problems = [];
  const lines = code.split('\n');
  let index = 0;
  lines.forEach((line, at) => {
    if (!/console\.\w+\(/.test(line)) return;
    const annotation = claimFor(lines, at);
    if (annotation === null) return;
    const actual = logs[index++];
    if (actual === undefined) return;
    const read = readExpected(annotation);
    if (!read) return;
    let target;
    try {
      target = read(std);
    } catch {
      return;
    }
    if (normalise(inspect(target)) !== normalise(annotation)) return;
    if (normalise(actual) !== normalise(printed(target))) {
      problems.push({ annotation, actual });
    }
  });
  return problems;
}

function decodeJsString(literal) {
  return literal.replace(
    /\\(\\|"|n|t|r|u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g,
    (m, esc) => {
      if (esc === 'n') return '\n';
      if (esc === 't') return '\t';
      if (esc === 'r') return '\r';
      if (esc === '\\' || esc === '"') return esc;
      if (esc.startsWith('u{')) {
        return String.fromCodePoint(Number.parseInt(esc.slice(2, -1), 16));
      }
      if (esc.startsWith('u')) {
        return String.fromCharCode(Number.parseInt(esc.slice(1), 16));
      }
      if (esc.startsWith('x')) {
        return String.fromCharCode(Number.parseInt(esc.slice(1), 16));
      }
      return m;
    },
  );
}

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve('timeout'), ms);
  });
  return Promise.race([promise.then(() => 'done'), timeout]).then((r) => {
    clearTimeout(timer);
    return r;
  });
}

const root = join(dirname(fromFileURL(import.meta.url)), '..');
const samples = [];
for await (const rel of new Glob('app/docs/*/*/page.mdx').scan(root)) {
  const source = await file(join(root, rel)).text();
  const match = /export const tryItCode = "((?:[^"\\]|\\.)*)";/.exec(source);
  if (!match) continue;
  samples.push({ rel, code: decodeJsString(match[1]) });
}
samples.sort((a, b) => (a.rel < b.rel ? -1 : 1));

describe('try-it samples', () => {
  for (const { rel, code } of samples) {
    test(rel, async () => {
      const compiled = transform(code, { probe: false });
      const events = [];
      let live = true;
      const outcome = await withTimeout(
        run(compiled.code, [], (event) => {
          if (live) events.push(event);
        }).finally(() => {
          live = false;
        }),
        8000,
      );
      expect(outcome).toBe('done');
      expect(events.filter((event) => event.type === 'error')).toEqual([]);
      expect(events.some((event) => event.type === 'log')).toBe(true);
      if (!NONDETERMINISTIC.has(rel)) {
        const logs = events
          .filter((event) => event.type === 'log')
          .map((event) => event.text);
        expect(checkLogs(code, logs)).toEqual([]);
      }
    });
  }
});
