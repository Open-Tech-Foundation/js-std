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

/** Adds readable indentation to the JavaScript-shaped values from inspect(). */
function formatStructured(text) {
  let result = '';
  let indent = 0;
  let quote = null;
  let escaped = false;

  for (const char of text) {
    if (quote) {
      result += char;
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      result += char;
    } else if (char === '{' || char === '[') {
      indent++;
      result += `${char}\n${'  '.repeat(indent)}`;
    } else if (char === '}' || char === ']') {
      indent = Math.max(0, indent - 1);
      result = result.trimEnd();
      result += `\n${'  '.repeat(indent)}${char}`;
    } else if (char === ',') {
      result += `,\n${'  '.repeat(indent)}`;
    } else if (char !== ' ' || !result.endsWith(`\n${'  '.repeat(indent)}`)) {
      // inspect() separates entries with ", "; the newline already supplies it.
      result += char;
    }
  }

  return result;
}

const LITERAL_TOKENS = new Set(['true', 'false', 'null', 'undefined']);
const MAX_COLLAPSED_LENGTH = 72;
const NUMBER_PATTERN =
  /-?(?:0[xX][\da-fA-F]+|0[bB][01]+|0[oO][0-7]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?n?)/y;

/** Tokenizes inspect() output without interpreting it as HTML or JavaScript. */
function tokenizeValue(text) {
  const tokens = [];
  const add = (type, value) => {
    const previous = tokens.at(-1);
    if (previous?.type === type) previous.text += value;
    else tokens.push({ type, text: value });
  };
  let index = 0;

  while (index < text.length) {
    const char = text[index];

    if (char === "'" || char === '"' || char === '`') {
      const start = index++;
      let escaped = false;
      while (index < text.length) {
        const current = text[index++];
        if (escaped) escaped = false;
        else if (current === '\\') escaped = true;
        else if (current === char) break;
      }
      let lookahead = index;
      while (/\s/.test(text[lookahead] ?? '')) lookahead++;
      add(text[lookahead] === ':' ? 'key' : 'string', text.slice(start, index));
      continue;
    }

    if (/[\d.-]/.test(char)) {
      NUMBER_PATTERN.lastIndex = index;
      const match = NUMBER_PATTERN.exec(text);
      if (match) {
        add('number', match[0]);
        index = NUMBER_PATTERN.lastIndex;
        continue;
      }
    }

    if (/[A-Za-z_$]/.test(char)) {
      const start = index++;
      while (/[\w$]/.test(text[index] ?? '')) index++;
      const word = text.slice(start, index);
      let lookahead = index;
      while (/\s/.test(text[lookahead] ?? '')) lookahead++;
      const type =
        text[lookahead] === ':'
          ? 'key'
          : LITERAL_TOKENS.has(word)
            ? 'literal'
            : word === 'NaN' || word === 'Infinity'
              ? 'number'
              : 'plain';
      add(type, word);
      continue;
    }

    add('plain', char);
    index++;
  }

  return tokens;
}

function appendToken(host, type, text) {
  const token = document.createElement('span');
  token.className = `rn-devtools-token rn-devtools-token--${type}`;
  token.textContent = text;
  host.append(token);
}

function renderParts(host, parts) {
  host.replaceChildren();
  parts.forEach((part, index) => {
    if (index) appendToken(host, 'plain', ' ');
    if (part.kind === 'string') appendToken(host, 'string', part.text);
    else {
      for (const token of tokenizeValue(part.text))
        appendToken(host, token.type, token.text);
    }
  });
}

function writeDevtools(host, level, text, parts) {
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
  const canColorize = level !== 'warn' && level !== 'error' && parts;
  if (canColorize) renderParts(value, parts);
  else value.textContent = text;

  const structured = parts
    ? parts.some((part) => part.kind === 'value' && looksStructured(part.text))
    : looksStructured(text);
  const expandable =
    structured || text.length > MAX_COLLAPSED_LENGTH || text.includes('\n');
  if (expandable) {
    const keepMarker = level === 'warn' || level === 'error';
    if (keepMarker)
      line.classList.toggle('rn-devtools-line--expandable-severity', true);
    const formatted = parts
      ? parts.map((part) =>
          part.kind === 'value' && looksStructured(part.text)
            ? { ...part, text: formatStructured(part.text) }
            : part,
        )
      : null;
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
      if (canColorize) {
        renderParts(value, expanded ? formatted : parts);
      } else {
        value.textContent =
          expanded && structured ? formatStructured(text) : text;
      }
    });
    if (keepMarker) line.append(marker, toggle, value);
    else line.append(toggle, value);
  } else {
    line.append(marker, value);
  }

  host.append(line);
}

export default function createConsole(host, { devtools = false } = {}) {
  const write = (text, className, level, parts) => {
    if (devtools) {
      const outputLevel =
        level ??
        (className.includes('rn-line--error')
          ? 'error'
          : className.includes('rn-line--warn')
            ? 'warn'
            : className.includes('rn-line--muted')
              ? 'debug'
              : 'log');
      writeDevtools(host, outputLevel, text, parts);
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

    log(level, text, parts) {
      write(text, LEVEL_CLASS[level] ?? LEVEL_CLASS.log, level, parts);
    },

    error(text) {
      write(text, 'rn-line rn-line--error');
    },

    note(text) {
      write(text, 'rn-line rn-line--muted');
    },
  };
}
