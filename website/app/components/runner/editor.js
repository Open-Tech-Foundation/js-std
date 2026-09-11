/**
 * The CodeMirror editor behind Try it and the playground.
 *
 * CodeMirror is loaded on demand rather than with the page. It is by far the
 * largest thing either surface needs, and a documentation page is read far more
 * often than its editor is scrolled to, so the import happens when an editor is
 * actually about to be shown.
 */

let loading = null;

/** Loads the editor packages once, however many editors ask for them. */
function load() {
  if (!loading) {
    loading = Promise.all([
      import('codemirror'),
      import('@codemirror/view'),
      import('@codemirror/state'),
      import('@codemirror/lang-javascript'),
      import('@codemirror/theme-one-dark'),
    ]);
  }
  return loading;
}

/** The site's current theme, which the editor has to match. */
function isDark() {
  const chosen = document.documentElement.getAttribute('data-theme');
  if (chosen) return chosen === 'dark';
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Creates an editor inside `parent`.
 *
 * @param {HTMLElement} parent
 * @param {{ doc: string, onRun?: () => void }} options `onRun` is bound to
 *   Ctrl/Cmd+Enter, the shortcut every editor of this kind uses.
 * @returns {Promise<{ value: () => string, set: (text: string) => void,
 *   destroy: () => void }>}
 */
export default async function createEditor(parent, options) {
  const [cm, view, state, lang, dark] = await load();
  const { EditorView, basicSetup } = cm;
  const { keymap } = view;
  const { Compartment, Prec } = state;

  // The theme is swapped in place rather than by rebuilding the editor, so a
  // reader toggling the site theme keeps whatever they had typed.
  const theme = new Compartment();

  const extensions = [
    basicSetup,
    lang.javascript(),
    EditorView.lineWrapping,
    theme.of(isDark() ? dark.oneDark : []),
  ];

  if (options.onRun) {
    extensions.push(
      // Ahead of the default bindings, which claim Enter for a newline.
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              options.onRun();
              return true;
            },
          },
        ]),
      ),
    );
  }

  const editor = new EditorView({ doc: options.doc, extensions, parent });

  const observer = new MutationObserver(() => {
    editor.dispatch({
      effects: theme.reconfigure(isDark() ? dark.oneDark : []),
    });
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return {
    value: () => editor.state.doc.toString(),
    set(text) {
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: text },
      });
    },
    destroy() {
      observer.disconnect();
      editor.destroy();
    },
  };
}
