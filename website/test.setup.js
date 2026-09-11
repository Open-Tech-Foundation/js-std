import { Window } from 'happy-dom';

/**
 * A DOM for the tests that build against the markup the site produces.
 *
 * The Try it section is assembled from a rendered function page — its example
 * blocks, its import line — so testing it needs a document rather than a mock
 * of one. Registering the globals here keeps the specs reading like browser
 * code.
 */
const window = new Window({
  url: 'https://js-std.opentechf.org/docs/Array/chunk',
});

for (const name of [
  'window',
  'document',
  'HTMLElement',
  'Node',
  'Event',
  'MutationObserver',
  'requestAnimationFrame',
  'cancelAnimationFrame',
]) {
  if (globalThis[name] === undefined) {
    globalThis[name] = window[name];
  }
}

/**
 * happy-dom has no intersection observer, and these tests want an inert one:
 * it is what triggers the CodeMirror import, which nothing here should pull in.
 */
if (globalThis.IntersectionObserver === undefined) {
  globalThis.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
}
