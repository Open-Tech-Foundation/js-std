import { describe, expect, test } from 'runtime:test';

import { Glob, file } from 'runtime:fs';
import { dirname, fromFileURL, join } from 'runtime:path';
import run from '../app/components/runner/run.js';
import transform from '../app/components/runner/transform.js';

/**
 * Every page's Try-it sample runs through the same pipeline the browser
 * uses — `transform` with probing off, then `run` — and must execute
 * without errors and print something. A sample that needs setup from the
 * page's prose fails here exactly as it would for a reader pressing Run,
 * so keep each `tryItCode` small and self-contained.
 */

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
    });
  }
});
