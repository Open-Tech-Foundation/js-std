import execute from './client.js';

/**
 * Turns the example blocks on a documentation page into runnable ones.
 *
 * The page is already complete without this: the examples are static HTML,
 * syntax-highlighted at build time and indexed by the site search. Nothing here
 * replaces that markup — a toolbar and an output panel are added beside it, and
 * the `<pre>` is only swapped for a textarea once a reader asks to edit. A
 * reader with no JavaScript, or a crawler, sees exactly what they saw before.
 *
 * Only the blocks under `## Examples` are enhanced. The `## Syntax` block above
 * them is a signature, not a program.
 */

const TIMEOUT = 5000;

const STATUS_MARK = {
  match: '✓',
  differs: '✗',
  unverified: '·',
  plain: '·',
};

/** The example blocks of a page, in the order they are written. */
function exampleBlocks(root) {
  const heading = root.querySelector('h2#examples');
  if (!heading) return [];

  const blocks = [];
  for (
    let node = heading.nextElementSibling;
    node && node.tagName !== 'H2';
    node = node.nextElementSibling
  ) {
    if (node.tagName === 'WEB-INTERNAL-CODE-BLOCK') blocks.push(node);
    else blocks.push(...node.querySelectorAll('web-internal-code-block'));
  }
  return blocks;
}

/** The source of a block, without the newline the highlighter leaves behind. */
function sourceOf(block) {
  return block.querySelector('pre')?.textContent.replace(/^\n|\n$/g, '') ?? '';
}

function button(label, className) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = label;
  return el;
}

function line(text, className) {
  const el = document.createElement('div');
  el.className = className;
  el.textContent = text;
  return el;
}

/**
 * Renders one probe as the documentation would write it.
 *
 * The expression is shown alongside its value because a block reports several
 * results at once, and `[[1, 2], [3]]` on its own does not say which line
 * produced it.
 */
function probeRow(probe, expr) {
  const row = document.createElement('div');
  row.className = `rn-row rn-row--${probe.status}`;

  const mark = document.createElement('span');
  mark.className = 'rn-mark';
  mark.textContent = STATUS_MARK[probe.status] ?? '·';

  const source = document.createElement('code');
  source.className = 'rn-expr';
  source.textContent = expr.split('\n')[0].slice(0, 60);

  const value = document.createElement('code');
  value.className = 'rn-value';
  value.textContent = probe.actual;

  row.append(mark, source, value);

  if (probe.status === 'differs') {
    const claim = document.createElement('span');
    claim.className = 'rn-claim';
    claim.textContent = `docs say ${probe.expected}`;
    row.append(claim);
  }
  return row;
}

/**
 * Wires one block.
 *
 * `prelude` is the source of every earlier example on the page, which several
 * pages depend on — `Cache/LruCache` fills a cache in its first block and reads
 * it in the second.
 */
function enhance(block, prelude) {
  const original = sourceOf(block);
  const pre = block.querySelector('pre');
  if (!pre || !original.trim()) return;

  block.dataset.rnReady = '';

  const bar = document.createElement('div');
  bar.className = 'rn-bar';

  const run = button('Run', 'rn-btn rn-btn--run');
  const edit = button('Edit', 'rn-btn');
  const reset = button('Reset', 'rn-btn');
  reset.hidden = true;

  const status = document.createElement('span');
  status.className = 'rn-status';

  bar.append(run, edit, reset, status);

  const output = document.createElement('div');
  output.className = 'rn-out';
  output.setAttribute('aria-live', 'polite');
  // The panel holds values, not prose, and would only dilute a search result.
  output.setAttribute('data-pagefind-ignore', '');
  output.hidden = true;

  block.append(bar, output);

  let editor = null;
  let running = false;

  const source = () => (editor ? editor.value : original);

  const startEditing = () => {
    if (editor) return;
    // Read the source before the textarea exists: `source()` prefers the
    // editor once there is one, and would hand back its own empty value.
    const text = source();

    editor = document.createElement('textarea');
    editor.className = 'rn-editor';
    editor.value = text;
    editor.spellcheck = false;
    editor.rows = text.split('\n').length + 1;
    editor.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        start();
      }
    });
    pre.hidden = true;
    pre.after(editor);
    edit.hidden = true;
    reset.hidden = false;
    editor.focus();
  };

  const stopEditing = () => {
    editor?.remove();
    editor = null;
    pre.hidden = false;
    edit.hidden = false;
    reset.hidden = true;
  };

  async function start() {
    if (running) return;
    running = true;
    run.textContent = 'Running…';
    status.textContent = '';
    output.hidden = false;
    output.replaceChildren();

    const counts = { match: 0, differs: 0 };
    let reported = false;
    let probes = [];

    await execute(source(), {
      prelude,
      timeout: TIMEOUT,
      onEvent(event) {
        reported = true;
        switch (event.type) {
          case 'probe': {
            counts[event.status] = (counts[event.status] ?? 0) + 1;
            output.append(probeRow(event, probes[event.id]?.expr ?? ''));
            break;
          }
          case 'log':
            output.append(line(event.text, `rn-log rn-log--${event.level}`));
            break;
          case 'error':
            output.append(line(`${event.name}: ${event.message}`, 'rn-error'));
            break;
          case 'timeout':
            output.append(
              line(`Stopped after ${event.ms / 1000}s.`, 'rn-error'),
            );
            break;
          case 'done':
            status.textContent = counts.differs
              ? `${counts.differs} result${counts.differs > 1 ? 's' : ''} differ`
              : `${event.ms} ms`;
            break;
        }
      },
      onProbes(table) {
        probes = table;
      },
    });

    if (!reported) output.append(line('No output.', 'rn-log'));
    running = false;
    run.textContent = 'Run';
  }

  run.addEventListener('click', start);
  edit.addEventListener('click', startEditing);
  reset.addEventListener('click', () => {
    stopEditing();
    output.hidden = true;
    output.replaceChildren();
    status.textContent = '';
  });
}

/**
 * Enhances every example block under `root` that is not already wired.
 *
 * Safe to call repeatedly: a block records that it has a toolbar, and one that
 * has is skipped — though its source still counts towards the prelude of the
 * blocks after it.
 */
export function enhanceExamples(root = document) {
  const blocks = exampleBlocks(root);
  const preceding = [];

  for (const block of blocks) {
    if (!('rnReady' in block.dataset)) {
      enhance(block, preceding.join('\n\n'));
    }
    preceding.push(sourceOf(block));
  }
  return blocks.length;
}

/**
 * Keeps the examples wired as the reader moves through the site.
 *
 * The docs are a single-page app after first paint, so a new page's blocks
 * arrive by DOM update rather than by page load. Watching the document for them
 * costs one observer and holds whatever order the router does things in, which
 * a route subscription would have to assume.
 */
export default function observeExamples(root = document) {
  enhanceExamples(root);

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enhanceExamples(root);
    });
  });

  observer.observe(root.body ?? root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
