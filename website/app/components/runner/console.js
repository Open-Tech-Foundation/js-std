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

export default function createConsole(host) {
  const write = (text, className) => {
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
