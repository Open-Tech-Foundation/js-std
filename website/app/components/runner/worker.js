import inspect from './inspect.js';
import run from './run.js';

/**
 * Executes a documentation example off the main thread.
 *
 * A worker rather than a direct `eval` for one reason above the rest: readers
 * edit these examples, and an edited example can loop forever. On the main
 * thread that freezes the page it is embedded in with no way back; here the
 * client terminates the worker and spawns another.
 *
 * The library is bundled into this chunk rather than fetched from a CDN, so a
 * documentation page makes no third-party request and runs exactly the version
 * it documents. The chunk loads on the first run, never on page load.
 */

let current = 0;

/**
 * Posts only while its run is the live one.
 *
 * An example may leave a timer behind — `idleRun` and `paceRun` exist to do
 * exactly that — and it will still fire after the run that created it has
 * finished. Stamping the run id and dropping stale messages keeps that output
 * out of the next run's panel.
 */
function reply(runId, message) {
  if (runId === current) self.postMessage({ runId, ...message });
}

function patchConsole(runId) {
  for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
    console[level] = (...args) => {
      reply(runId, {
        type: 'log',
        level,
        text: args
          .map((a) => (typeof a === 'string' ? a : inspect(a)))
          .join(' '),
      });
    };
  }
}

self.onmessage = async (event) => {
  const { runId, code, probes } = event.data;
  current = runId;
  patchConsole(runId);
  await run(code, probes, (message) => reply(runId, message));
};
