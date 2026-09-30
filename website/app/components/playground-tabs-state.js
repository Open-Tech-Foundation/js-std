/** Applies the accessible and visual state for a Playground mode tab. */
export function updatePlaygroundTabSelection(tabs, panels, id) {
  for (const tab of tabs) {
    const selected = tab.dataset.tab === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    tab.classList.toggle('border-blue-500', selected);
    tab.classList.toggle('border-transparent', !selected);
    tab.classList.toggle('text-[var(--otfw-text)]', selected);
    tab.classList.toggle('text-[var(--otfw-text-muted)]', !selected);
  }
  for (const panel of panels) panel.hidden = panel.dataset.panel !== id;
}
