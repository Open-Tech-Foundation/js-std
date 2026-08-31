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

    // The editor lives inside the tree being watched and rewrites its own DOM
    // on every keystroke, so a mutation on its own says nothing. The route is
    // what actually changed the page, and it is checked instead.
    let current = location.pathname;
    const observer = new MutationObserver(() => {
      if (location.pathname === current) return;
      current = location.pathname;
      tryIt.update();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    onCleanup(() => {
      observer.disconnect();
      tryIt.destroy();
    });
  });

  return <div ref={host} class="rn-mount" />;
}
