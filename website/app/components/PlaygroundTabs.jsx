import { onCleanup, onMount } from '@opentf/web';
import Playground from './Playground.jsx';
import VisualTools from './VisualTools.jsx';

/** Switches between the code editor and the flow-control visualisers. */
export default function PlaygroundTabs() {
  const host = $ref();

  onMount(() => {
    if (!host) return;

    const tabs = [...host.querySelectorAll('[role="tab"]')];
    const panels = [...host.querySelectorAll('[role="tabpanel"]')];

    const select = (id) => {
      for (const tab of tabs) {
        const selected = tab.dataset.tab === id;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      }
      for (const panel of panels) panel.hidden = panel.dataset.panel !== id;
    };

    const onClick = (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab && host.contains(tab)) select(tab.dataset.tab);
    };
    const onKeyDown = (event) => {
      const index = tabs.indexOf(event.target);
      if (index === -1) return;
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
      event.preventDefault();
      const next =
        key === 'Home'
          ? 0
          : key === 'End'
            ? tabs.length - 1
            : (index + (key === 'ArrowRight' ? 1 : tabs.length - 1)) %
              tabs.length;
      tabs[next].focus();
      select(tabs[next].dataset.tab);
    };

    host.addEventListener('click', onClick);
    host.addEventListener('keydown', onKeyDown);
    onCleanup(() => {
      host.removeEventListener('click', onClick);
      host.removeEventListener('keydown', onKeyDown);
    });
  });

  return (
    <section ref={host} class="mt-8">
      <div
        role="tablist"
        aria-label="Playground modes"
        class="flex gap-1 border-b border-[var(--otfw-border)] mb-8"
      >
        <button
          type="button"
          role="tab"
          id="playground-tab"
          aria-controls="playground-panel"
          aria-selected="true"
          data-tab="playground"
          class="px-4 py-2 font-semibold border-b-2 border-blue-500 text-[var(--otfw-text)]"
        >
          Playground
        </button>
        <button
          type="button"
          role="tab"
          id="interactive-tools-tab"
          aria-controls="interactive-tools-panel"
          aria-selected="false"
          tabindex="-1"
          data-tab="tools"
          class="px-4 py-2 font-semibold border-b-2 border-transparent text-[var(--otfw-text-muted)] hover:text-[var(--otfw-text)]"
        >
          Interactive Tools
        </button>
      </div>

      <div
        id="playground-panel"
        role="tabpanel"
        aria-labelledby="playground-tab"
        data-panel="playground"
      >
        <Playground />
      </div>
      <div
        id="interactive-tools-panel"
        role="tabpanel"
        aria-labelledby="interactive-tools-tab"
        data-panel="tools"
        hidden
      >
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold mb-2">Interactive Tools</h2>
          <p class="text-gray-400">
            Simulate and visualize the flow control utilities in real time.
          </p>
        </div>
        <VisualTools />
      </div>
    </section>
  );
}
