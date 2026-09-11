import execute from './client.js';
import createConsole from './console.js';
import createEditor from './editor.js';

const TIMEOUT = 5000;

function button(label, className) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = label;
  return el;
}

/** Mounts one page-authored sample into its own component host. */
export default function mountTryIt(host, code = '') {
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
  section.append(heading, panel, output);
  host.append(section);

  const out = createConsole(output);
  const preview = document.createElement('pre');
  preview.className = 'rn-preview';
  surface.append(preview);
  const doc = code ? `${code}\n` : '';
  preview.textContent = doc;
  section.hidden = doc === '';

  let editor = null;
  let editing = null;
  let running = false;
  function ensureEditor() {
    if (!editing) {
      editing = createEditor(surface, { doc, onRun: start })
        .then((created) => {
          editor = created;
          preview.remove();
        })
        .catch((error) => {
          editing = null;
          throw error;
        });
    }
    return editing;
  }

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
          if (event.type === 'log') out.log(event.level, event.text);
          else if (event.type === 'error')
            out.error(`${event.name}: ${event.message}`);
          else if (event.type === 'timeout')
            out.error(`Stopped after ${event.ms / 1000}s.`);
          else if (event.type === 'done' && out.empty)
            out.note('Ran with no output.');
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
    destroy() {
      watcher.disconnect();
      editor?.destroy();
      section.remove();
    },
  };
}
