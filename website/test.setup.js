// esdev deliberately does not implement Node compatibility, so browser-like
// runner tests use the small DOM fixture in tryit.spec.js rather than a
// Node-oriented DOM package such as happy-dom.
if (globalThis.IntersectionObserver === undefined) {
  globalThis.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
}
