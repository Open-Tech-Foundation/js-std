import { onCleanup, onMount } from '@opentf/web';
import observeExamples from './runner/enhance.js';

/**
 * Makes the examples on a documentation page runnable.
 *
 * Rendered by the docs layout rather than by each page: the work is done
 * against the DOM the MDX already produced, so there is nothing for a page to
 * opt into and nothing to add to 310 files. The element it returns is a marker
 * — everything visible is attached to the existing code blocks.
 */
export default function DocsRunner() {
  onMount(() => {
    const stop = observeExamples(document);
    onCleanup(stop);
  });

  return <div class="rn-mount" hidden />;
}
