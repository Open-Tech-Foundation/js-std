import execute from './client.js';
import createConsole from './console.js';
import createEditor from './editor.js';

/**
 * The playground's split view: a program on the left, its output on the right.
 *
 * The same three parts as Try it, arranged for writing rather than for reading
 * — the editor is the page here, not a footnote to one, so it takes half the
 * width and the output sits beside it instead of below.
 */

const TIMEOUT = 10_000;

const STARTER = `import { chunk, groupBy, sleep, retryRun } from '@opentf/std';

console.log(chunk([1, 2, 3, 4, 5], 2));

const people = [
  { name: 'Ada', team: 'core' },
  { name: 'Lin', team: 'docs' },
  { name: 'Ravi', team: 'core' },
];
console.log(groupBy(people, (p) => p.team));

// Everything here is async-ready — top-level await works.
await sleep(100);

let attempts = 0;
const value = await retryRun(
  // retryRun retries a rejected promise, so the callback is async.
  async () => {
    attempts++;
    if (attempts < 3) throw new Error('not ready yet');
    return 'succeeded on attempt ' + attempts;
  },
  { retries: 3, delay: 50 },
);
console.log(value);
`;

function button(label, className) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = label;
  return el;
}

/** Builds the split view into `host`. */
export default function mountPlayground(host) {
  const toolbar = document.createElement('div');
  toolbar.className = 'rn-toolbar';

  const run = button('Run', 'rn-btn rn-btn--run');
  const reset = button('Reset', 'rn-btn');
  const clear = button('Clear output', 'rn-btn');

  const hint = document.createElement('span');
  hint.className = 'rn-hint';
  hint.textContent = 'Ctrl/⌘ + Enter to run';

  toolbar.append(run, reset, clear, hint);

  const split = document.createElement('div');
  split.className = 'rn-split';

  const surface = document.createElement('div');
  surface.className = 'rn-surface';

  const output = document.createElement('div');
  output.className = 'rn-console';
  output.setAttribute('aria-live', 'polite');

  split.append(surface, output);
  host.append(toolbar, split);

  const out = createConsole(output);
  let editor = null;
  let running = false;

  async function start() {
    if (running || !editor) return;
    running = true;
    run.textContent = 'Running…';
    out.clear();

    await execute(editor.value(), {
      probe: false,
      timeout: TIMEOUT,
      onEvent(event) {
        switch (event.type) {
          case 'log':
            out.log(event.level, event.text);
            break;
          case 'error':
            out.error(`${event.name}: ${event.message}`);
            break;
          case 'timeout':
            out.error(`Stopped after ${event.ms / 1000}s.`);
            break;
          case 'done':
            if (out.empty) out.note('Ran with no output.');
            break;
        }
      },
    });

    running = false;
    run.textContent = 'Run';
  }

  run.addEventListener('click', start);
  clear.addEventListener('click', () => out.clear());
  reset.addEventListener('click', () => {
    editor?.set(STARTER);
    out.clear();
  });

  const ready = createEditor(surface, { doc: STARTER, onRun: start }).then(
    (created) => {
      editor = created;
    },
  );

  return {
    ready,
    destroy() {
      editor?.destroy();
      toolbar.remove();
      split.remove();
    },
  };
}
