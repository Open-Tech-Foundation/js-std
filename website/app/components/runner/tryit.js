import execute from './client.js';
import createConsole from './console.js';
import createEditor from './editor.js';
import { seedFromExample } from './seed.js';

/**
 * The Try it editor at the foot of every function page.
 *
 * In direct mode the caller passes a string of source code; the section is
 * built into `host` with that code as the seed.
 *
 * In DOM mode the caller passes the page (or a sub-tree of it). The function
 * finds the `## Try it` heading authored in the page's MDX, reads the source
 * from the `<pre>` that follows it, and inserts the section right after that
 * `<pre>` — so the visible heading in the page is the one and only Try it
 * heading, and the editor lands where the reader is already looking.
 */

const TIMEOUT = 5000;
let active = null;

function button(label, className) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = label;
  return el;
}

/** Finds the `<pre>`-bearing block that follows `el`, or null. */
function nextPre(el) {
  let n = el?.nextElementSibling;
  while (n) {
    // The seed belongs to this heading alone. Once consumed, the runner is
    // immediately next; do not mistake its preview (or a later docs section)
    // for a fresh seed on a mutation-driven update.
    if (
      n.classList?.contains('rn-tryit') ||
      n.className?.split(/\s+/).includes('rn-tryit') ||
      /^H[1-6]$/.test(n.tagName)
    ) {
      return null;
    }
    if (n.tagName === 'PRE') return n;
    const inner = n.querySelector?.('pre');
    if (inner) return n;
    n = n.nextElementSibling;
  }
  return null;
}

function sourceOf(root) {
  const heading = root.querySelector?.('h2#try-it');
  const block = nextPre(heading);
  const pre =
    block?.querySelector?.('pre') ?? (block?.tagName === 'PRE' ? block : null);
  const raw = pre?.textContent?.replace(/^\n|\n$/g, '') ?? '';
  return { heading, block, raw };
}

/**
 * Builds the section.
 *
 * @param {HTMLElement|Document} [host] Used only in direct mode. Ignored in
 *   DOM mode, where the section is inserted right after the source `<pre>`.
 * @param {string|Document|Element} input Direct: a source string. DOM: the
 *   page (or a sub-tree) to read `## Try it` from.
 * @returns {{ section: HTMLElement, update: () => void, destroy: () => void }}
 */
export default function mountTryIt(host, input = document) {
  // DocsRunner can be connected again while the docs layout hydrates. Keep the
  // page singleton here, at the boundary where an editor is actually created.
  active?.destroy();

  const direct = typeof input === 'string';

  const section = document.createElement('section');
  section.className = 'rn-tryit';
  section.setAttribute('data-pagefind-ignore', '');

  const heading = document.createElement('h2');
  heading.textContent = 'Try it';

  const panel = document.createElement('div');
  panel.className = 'rn-panel';

  const surface = document.createElement('div');
  surface.className = 'rn-surface';

  const side = document.createElement('div');
  side.className = 'rn-side';

  const run = button('Run', 'rn-btn rn-btn--run');
  const reset = button('Reset', 'rn-btn');
  const hint = document.createElement('span');
  hint.className = 'rn-hint';
  hint.textContent = '⌘⏎';

  side.append(run, reset, hint);
  panel.append(surface, side);

  const output = document.createElement('div');
  output.className = 'rn-console';
  output.setAttribute('aria-live', 'polite');

  if (direct) section.append(heading);
  section.append(panel, output);

  if (direct) {
    host.append(section);
  } else {
    const { block } = sourceOf(input);
    if (block && block.parentNode) {
      block.parentNode.insertBefore(section, block.nextSibling);
    }
  }

  const out = createConsole(output);

  const preview = document.createElement('pre');
  preview.className = 'rn-preview';
  surface.append(preview);

  let editor = null;
  let editing = null;
  let doc = '';
  let running = false;

  function ensureEditor() {
    if (!editing) {
      editing = createEditor(surface, { doc, onRun: start })
        .then((created) => {
          editor = created;
          created.set(doc);
          preview.remove();
        })
        .catch((error) => {
          editing = null;
          throw error;
        });
    }
    return editing;
  }

  const build = (raw) => (raw ? `${seedFromExample(raw)}\n` : '');

  async function start() {
    if (running) return;
    running = true;
    run.textContent = 'Running…';
    out.clear();

    try {
      await ensureEditor();
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
    } catch (error) {
      out.error(`${error?.name ?? 'Error'}: ${error?.message ?? error}`);
    } finally {
      running = false;
      run.textContent = 'Run';
    }
  }

  run.addEventListener('click', start);
  reset.addEventListener('click', () => {
    editor?.set(doc);
    out.clear();
  });

  function refresh() {
    if (direct) {
      const next = build(input);
      section.hidden = next === '';
      if (next === '' || next === doc) return;

      doc = next;
      out.clear();
      preview.textContent = next;
      editor?.set(next);
      return;
    }

    const { heading, block, raw } = sourceOf(input);
    // After the seed is consumed, the editor is its replacement. A later
    // observer update on the same page finds no seed and deliberately keeps
    // the existing editor and its current text intact.
    if (!block) {
      if (!section.isConnected) section.hidden = true;
      return;
    }

    block.parentNode.insertBefore(section, block.nextSibling);
    block.remove();

    const next = build(raw);
    section.hidden = next === '' || !heading || !section.isConnected;
    if (next === '' || next === doc) return;

    doc = next;
    out.clear();
    preview.textContent = next;
    editor?.set(next);
  }

  refresh();

  const watcher = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        watcher.disconnect();
        ensureEditor();
      }
    },
    { rootMargin: '400px' },
  );
  watcher.observe(section);

  const view = {
    section,
    update: direct ? () => {} : refresh,
    destroy() {
      watcher.disconnect();
      editor?.destroy();
      section.remove();
      if (active === view) active = null;
    },
  };

  active = view;
  return view;
}
