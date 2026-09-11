import { onCleanup, onMount } from '@opentf/web';
import mountTryIt from './runner/tryit.js';

/** A page-local runnable example. `code` is authored by the MDX page itself. */
export default function TryIt(props) {
  const host = $ref();

  onMount(() => {
    if (!host) return;
    const view = mountTryIt(host, props.code);
    onCleanup(() => view.destroy());
  });

  return <div ref={host} />;
}
