import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

const roots = new WeakMap();

/** Mount a React component into an OTF Web host element. */
export function mountReact(el, Component, props = {}) {
  if (!el) return () => {};
  let root = roots.get(el);
  if (!root) {
    root = createRoot(el);
    roots.set(el, root);
  }
  root.render(createElement(Component, props));
  return () => {
    root.unmount();
    roots.delete(el);
  };
}

export function readTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}
