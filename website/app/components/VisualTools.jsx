import VisualToolsPanel from './VisualToolsPanel.jsx';
import { mountReact } from './react-bridge.js';

export default function VisualTools() {
  const host = $ref();
  let dispose = null;

  onMount(() => {
    if (!host) return;
    dispose = mountReact(host, VisualToolsPanel);
    onCleanup(() => dispose?.());
  });

  return <div ref={host} />;
}
