import { Window } from 'happy-dom';

/**
 * A DOM for the tests that exercise the docs-page enhancer.
 *
 * The enhancer works against the markup the build produces, so testing it needs
 * a document rather than a mock of one. Registering the globals here — rather
 * than per file — keeps the specs reading like browser code.
 */
const window = new Window({
  url: 'https://js-std.opentechf.org/docs/Array/chunk',
});

for (const name of [
  'window',
  'document',
  'HTMLElement',
  'Node',
  'MutationObserver',
  'requestAnimationFrame',
  'cancelAnimationFrame',
]) {
  if (globalThis[name] === undefined) {
    globalThis[name] = window[name];
  }
}
