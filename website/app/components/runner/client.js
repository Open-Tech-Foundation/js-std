import transform from './transform.js';

/**
 * The main thread's half of the runner.
 *
 * Owns one worker for the whole page, spawned on the first run rather than at
 * load, so a reader who never presses Run never pays for the library. The
 * worker is reused between runs — it holds a parsed copy of a library the size
 * of this one — and replaced only when a run has to be killed.
 */

const DEFAULT_TIMEOUT = 5000;

let worker = null;
let nextRunId = 1;

function spawn() {
  worker = new Worker(new URL('./worker.js', import.meta.url), {
    type: 'module',
  });
  return worker;
}

/** Kills a run that will not end on its own, so the next one starts clean. */
function terminate() {
  worker?.terminate();
  worker = null;
}

/**
 * Runs one example, reporting each result as it arrives.
 *
 * `prelude` is the source of the earlier examples on the same page. Several
 * pages are written as one session — `Cache/LruCache` builds a cache in its
 * first block and reads it in the second — so an example is run with what came
 * before it in scope. Results from those lines are dropped: the reader pressed
 * Run on this block, not on the page.
 *
 * @param {string} source The example as written.
 * @param {{ prelude?: string, timeout?: number, probe?: boolean,
 *   onEvent: Function, onProbes?: Function }} options `probe` reports the value
 *   of every annotated statement, which is how the example tests read a run;
 *   an editor prints through `console.log` instead and leaves it off.
 *   `onProbes` receives the probe table before the run starts, so a caller can
 *   label a result with the expression that produced it.
 * @returns {Promise<void>} Settles when the run finishes, times out, or fails.
 */
export default function execute(source, options) {
  const {
    prelude = '',
    timeout = DEFAULT_TIMEOUT,
    probe = true,
    onEvent,
  } = options;

  // The prelude is transformed together with the example so that a statement
  // spanning the seam is still read as one; its own probes are then discarded.
  const offset = prelude ? prelude.split('\n').length : 0;
  const combined = prelude ? `${prelude}\n${source}` : source;

  let result;
  try {
    result = transform(combined, { probe });
  } catch (error) {
    onEvent({ type: 'error', name: 'Error', message: error.message });
    onEvent({ type: 'done', ms: 0 });
    return Promise.resolve();
  }

  options.onProbes?.(result.probes);

  const runId = nextRunId++;
  const active = worker ?? spawn();

  return new Promise((resolve) => {
    let timer = null;

    const finish = () => {
      clearTimeout(timer);
      active.removeEventListener('message', onMessage);
      active.removeEventListener('error', onError);
      resolve();
    };

    const onMessage = (event) => {
      const message = event.data;
      if (message.runId !== runId) return;

      if (message.type === 'probe') {
        if (message.line < offset) return;
        onEvent({ ...message, line: message.line - offset });
        return;
      }

      onEvent(message);
      if (message.type === 'done') finish();
    };

    active.addEventListener('message', onMessage);

    const onError = (event) => {
      terminate();
      onEvent({
        type: 'error',
        name: 'WorkerError',
        message: event.message ?? 'The runner worker could not start.',
      });
      finish();
    };

    active.addEventListener('error', onError);

    timer = setTimeout(() => {
      // A reader can edit these examples, and an edited one can loop forever.
      // Nothing short of terminating the worker gets the thread back.
      terminate();
      onEvent({ type: 'timeout', ms: timeout });
      finish();
    }, timeout);

    active.postMessage({ runId, code: result.code, probes: result.probes });
  });
}
