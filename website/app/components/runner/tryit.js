import execute from './client.js';
import createConsole from './console.js';
import createEditor from './editor.js';
import seed from './seed.js';

/**
 * The Try it section at the foot of every function page.
 *
 * It opens with the page's own examples, rewritten so that running them prints
 * something, and the reader edits from there. One editor per page rather than a
 * control on each example block: the examples on a page are one sequence — a
 * cache built in the first is read in the second — and a reader who wants to
 * change something wants the whole sample in front of them, not a fragment.
 */

const TIMEOUT = 5000;

/** The source of every example block on the page, in the order written. */
function examplesOf(root) {
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

  return blocks
    .map((block) => block.querySelector('pre')?.textContent ?? '')
    .map((text) => text.replace(/^\n|\n$/g, ''))
    .filter((text) => text.trim() !== '');
}

/**
 * The import line the page's Syntax block opens with.
 *
 * Taking it from the page rather than rebuilding it from the URL keeps the
 * sample honest about what to import, including the pages that export more than
 * one name.
 */
function importOf(root) {
  const heading = root.querySelector('h2#syntax');
  const block = heading?.nextElementSibling?.querySelector('pre');
  const first = block?.textContent.trim().split('\n')[0] ?? '';
  return /^import\b/.test(first) ? first : '';
}

function button(label, className) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = label;
  return el;
}

/**
 * Builds the section into `host`.
 *
 * @returns {{ section: HTMLElement, update: () => void, destroy: () => void }}
 *   `update` re-seeds the editor from the page currently in the DOM, which is
 *   how a client-side navigation is handled, and `section` is the element to
 *   exclude when watching for one.
 */
export default function mountTryIt(host, root = document) {
  const section = document.createElement('section');
  section.className = 'rn-tryit';
  // The sample is the page's own examples again, and the output is values;
  // neither belongs in a search result.
  section.setAttribute('data-pagefind-ignore', '');

  const heading = document.createElement('h2');
  heading.id = 'try-it';
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

  section.append(heading, panel, output);
  host.append(section);

  const out = createConsole(output);

  // Shown until the editor is built, so the section is readable the moment it
  // scrolls into view rather than after a 250 kB import has landed.
  const preview = document.createElement('pre');
  preview.className = 'rn-preview';
  surface.append(preview);

  let editor = null;
  let editing = null;
  let source = '';
  let running = false;

  /**
   * Builds the editor, once, on the first sign that it is wanted.
   *
   * CodeMirror is the largest thing this page can pull, and the section sits
   * below everything else on it, so most readers never reach it. It is imported
   * when the section approaches the viewport, or immediately if a reader gets
   * to Run before that — not when the page mounts.
   */
  function ensureEditor() {
    if (!editing) {
      editing = createEditor(surface, { doc: source, onRun: start }).then(
        (created) => {
          editor = created;
          // The page may have changed while the import was in flight.
          created.set(source);
          preview.remove();
        },
      );
    }
    return editing;
  }

  const build = () => {
    const examples = examplesOf(root);
    if (!examples.length) return '';
    return seed(examples, { header: importOf(root) });
  };

  async function start() {
    if (running) return;
    await ensureEditor();
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
  reset.addEventListener('click', () => {
    editor?.set(source);
    out.clear();
  });

  /**
   * Seeds the editor from whatever page is in the DOM.
   *
   * The section is hidden rather than removed on a page with no examples — the
   * overview pages, and `security` — because the reader may navigate from one
   * to a function page without this component being rebuilt.
   */
  function refresh() {
    const next = build();
    section.hidden = next === '';
    if (next === '' || next === source) return;

    source = next;
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

  return {
    section,
    update: refresh,
    destroy() {
      watcher.disconnect();
      editor?.destroy();
      section.remove();
    },
  };
}
