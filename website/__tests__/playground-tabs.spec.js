import { describe, expect, test } from 'runtime:test';
import { updatePlaygroundTabSelection } from '../app/components/playground-tabs-state.js';

function tab(id, classes = []) {
  const names = new Set(classes);
  return {
    dataset: { tab: id },
    attributes: {},
    classList: {
      contains: (name) => names.has(name),
      toggle(name, force) {
        if (force) names.add(name);
        else names.delete(name);
      },
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    get classes() {
      return names;
    },
  };
}

describe('Playground tab selection', () => {
  test('updates the selected tab style, accessibility state, and panel', () => {
    const playground = tab('playground', [
      'border-blue-500',
      'text-[var(--otfw-text)]',
    ]);
    const tools = tab('tools', [
      'border-transparent',
      'text-[var(--otfw-text-muted)]',
    ]);
    const playgroundPanel = { dataset: { panel: 'playground' }, hidden: false };
    const toolsPanel = { dataset: { panel: 'tools' }, hidden: true };

    updatePlaygroundTabSelection(
      [playground, tools],
      [playgroundPanel, toolsPanel],
      'tools',
    );

    expect(playground.attributes['aria-selected']).toBe('false');
    expect(playground.tabIndex).toBe(-1);
    expect(playground.classes.has('border-transparent')).toBe(true);
    expect(playground.classes.has('text-[var(--otfw-text-muted)]')).toBe(true);
    expect(tools.attributes['aria-selected']).toBe('true');
    expect(tools.tabIndex).toBe(0);
    expect(tools.classes.has('border-blue-500')).toBe(true);
    expect(tools.classes.has('text-[var(--otfw-text)]')).toBe(true);
    expect(playgroundPanel.hidden).toBe(true);
    expect(toolsPanel.hidden).toBe(false);
  });
});
