import { onCleanup, onMount } from '@opentf/web';
import mountPlayground from './runner/playground.js';

/**
 * The editor half of the playground: write anything against the library and
 * see what it prints, without installing it first.
 */
export default function Playground() {
  const host = $ref();

  onMount(() => {
    if (!host) return;
    const view = mountPlayground(host);
    onCleanup(() => view.destroy());
  });

  return <div ref={host} class="rn-playground" />;
}
