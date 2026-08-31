import { onCleanup, onMount } from '@opentf/web';
import mountTryIt from './runner/tryit.js';

/**
 * Adds the Try it section to a function page.
 *
 * The docs layout renders this at the end of the page's own content, which is
 * where the section belongs, so it builds itself in place rather than hunting
 * for a container. It is mounted once for the whole docs section: the site is a
 * single-page app after first paint, so moving between function pages replaces
 * the content around it, and the observer re-seeds the editor when it does.
 */
export default function DocsRunner() {
  const host = $ref();

  onMount(() => {
    if (!host) return;

    const tryIt = mountTryIt(host, document);

    // Re-seeded from what is in the DOM rather than from the URL: on a
    // client-side navigation the address changes before the new page's content
    // is rendered, so a component reading the route on its own found an empty
    // page and hid itself for good.
    //
    // The editor is inside the tree being watched and rewrites its own DOM on
    // every keystroke, so mutations confined to the section are the one thing
    // that says nothing about the page and are dropped.
    let queued = false;
    const observer = new MutationObserver((records) => {
      if (records.every((record) => tryIt.section.contains(record.target))) {
        return;
      }
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        tryIt.update();
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    onCleanup(() => {
      observer.disconnect();
      tryIt.destroy();
    });
  });

  return <div ref={host} class="rn-mount" />;
}
