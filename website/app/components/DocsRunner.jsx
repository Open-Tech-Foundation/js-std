import { onCleanup, onMount } from '@opentf/web';
import mountTryIt from './runner/tryit.js';

/**
 * Renders the Try it editor on a function page.
 *
 * Each function page is authored with a `## Try it` heading followed by a
 * fenced code block. `mountTryIt` finds that heading at runtime, reads the
 * source from the `<pre>` that follows, and inserts the editor section right
 * under it — so the visible heading in the page is the one and only Try it
 * heading, and the editor appears where the reader is already looking.
 */
export default function DocsRunner() {
  let view = null;

  onMount(() => {
    view = mountTryIt(document);

    // The site is a single-page app: a route change replaces the page beneath
    // this persistent component. Ignore editor-local mutations, then attach
    // the section to the new page on the next frame.
    let queued = false;
    const observer = new MutationObserver((records) => {
      if (
        !view ||
        records.every((record) => view.section.contains(record.target))
      )
        return;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        view?.update();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    onCleanup(() => {
      observer.disconnect();
      view?.destroy();
      view = null;
    });
  });

  return <></>;
}
