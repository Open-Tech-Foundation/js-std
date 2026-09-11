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

    // The route layout can mount before the MDX chunk has finished inserting
    // its content. Retry briefly after a page mutation; a full reload did not
    // expose this because its content already existed before mount.
    let queued = false;
    function update(attempts = 8) {
      queued = false;
      if (view?.update() || attempts === 0) return;
      queued = true;
      requestAnimationFrame(() => update(attempts - 1));
    }

    const observer = new MutationObserver((records) => {
      if (
        !view ||
        records.every((record) => view.section.contains(record.target))
      )
        return;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => update());
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
