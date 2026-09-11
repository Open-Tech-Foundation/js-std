/**
 * The output panel shared by Try it and the playground.
 *
 * It shows what the program printed, in the order it printed it, and nothing
 * else — no verdicts, no summary of the run. `console.log` is what the samples
 * are written around, so what a reader sees here is what they would see in
 * their own terminal.
 */

const LEVEL_CLASS = {
  log: 'rn-line',
  info: 'rn-line',
  debug: 'rn-line rn-line--muted',
  warn: 'rn-line rn-line--warn',
  error: 'rn-line rn-line--error',
};

function looksStructured(text) {
  return (
    /^[{[]/.test(text) ||
    /^(?:Map|Set|ArrayBuffer|Uint\d+Array|Promise)\b/.test(text)
  );
}

function writeDevtools(host, level, text) {
  const line = document.createElement('div');
  line.className = `rn-devtools-line rn-devtools-line--${level}`;

  const marker = document.createElement('span');
  marker.className = 'rn-devtools-marker';
  marker.textContent =
    level === 'warn'
      ? '!'
      : level === 'error'
        ? '×'
        : level === 'info'
          ? 'i'
          : '›';

  const value = document.createElement('code');
  value.className = 'rn-devtools-value';
  value.textContent = text;
  if (looksStructured(text)) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'rn-devtools-disclosure';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Expand value');
    toggle.textContent = '›';
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute(
        'aria-label',
        expanded ? 'Collapse value' : 'Expand value',
      );
      line.classList.toggle('is-expanded', expanded);
    });
    line.append(toggle, value);
  } else {
    line.append(marker, value);
  }

  host.append(line);
}

export default function createConsole(host, { devtools = false } = {}) {
  const write = (text, className) => {
    if (devtools) {
      const level = className.includes('rn-line--error')
        ? 'error'
        : className.includes('rn-line--warn')
          ? 'warn'
          : className.includes('rn-line--muted')
            ? 'debug'
            : 'log';
      writeDevtools(host, level, text);
      return host.lastElementChild;
    }
    const line = document.createElement('div');
    line.className = className;
    line.textContent = text;
    host.append(line);
    return line;
  };

  return {
    clear() {
      host.replaceChildren();
    },

    /** Whether anything has been written since the last clear. */
    get empty() {
      return host.childElementCount === 0;
    },

    log(level, text) {
      write(text, LEVEL_CLASS[level] ?? LEVEL_CLASS.log);
    },

    error(text) {
      write(text, 'rn-line rn-line--error');
    },

    note(text) {
      write(text, 'rn-line rn-line--muted');
    },
  };
}
