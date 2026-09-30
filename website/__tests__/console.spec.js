import { describe, expect, test } from 'runtime:test';

import createConsole from '../app/components/runner/console.js';

class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this._className = '';
    this._textContent = '';
    this.classList = {
      toggle: (name, force) => {
        const classes = new Set(this._className.split(/\s+/).filter(Boolean));
        if (force) classes.add(name);
        else classes.delete(name);
        this._className = [...classes].join(' ');
      },
    };
  }

  set className(value) {
    this._className = value;
  }

  get className() {
    return this._className;
  }

  get textContent() {
    return this.children.length
      ? this.children.map((child) => child.textContent).join('')
      : this._textContent;
  }

  set textContent(value) {
    this.children = [];
    this._textContent = String(value);
  }

  get childElementCount() {
    return this.children.length;
  }

  get lastElementChild() {
    return this.children.at(-1) ?? null;
  }

  append(...children) {
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this.children = children;
    this._textContent = '';
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  click() {
    this.listeners.get('click')?.();
  }
}

globalThis.document = {
  createElement: (tagName) => new Element(tagName),
};

describe('Playground console output', () => {
  test('colors keys, strings, numbers, and literals safely', () => {
    const host = new Element('div');
    const output = createConsole(host, { devtools: true });
    const parts = [
      { kind: 'string', text: '<img>' },
      {
        kind: 'value',
        text: "{ name: 'Ada', age: 37, active: true, missing: null }",
      },
    ];
    const text = parts.map((part) => part.text).join(' ');

    output.log('log', text, parts);

    const [line] = host.children;
    const value = line.children[1];
    expect(value.textContent).toBe(text);
    expect(value.children[0].textContent).toBe('<img>');
    expect(value.children.some((token) => token.tagName === 'img')).toBe(false);
    expect(
      value.children.some((token) => token.className.endsWith('--key')),
    ).toBe(true);
    expect(
      value.children.some((token) => token.className.endsWith('--string')),
    ).toBe(true);
    expect(
      value.children.some((token) => token.className.endsWith('--number')),
    ).toBe(true);
    expect(
      value.children.some((token) => token.className.endsWith('--literal')),
    ).toBe(true);
  });

  test('keeps warning rows in their existing severity style', () => {
    const host = new Element('div');
    const output = createConsole(host, { devtools: true });
    const text = "{ message: 'careful' }";

    output.log('warn', text, [{ kind: 'value', text }]);

    const [line] = host.children;
    const value = line.children[1];
    expect(line.className).toContain('rn-devtools-line--warn');
    expect(value.textContent).toBe(text);
    expect(value.children).toEqual([]);
  });

  test('keeps syntax colors when an object is expanded', () => {
    const host = new Element('div');
    const output = createConsole(host, { devtools: true });
    const parts = [{ kind: 'value', text: "{ name: 'Ada', age: 37 }" }];
    output.log('log', parts[0].text, parts);

    const [line] = host.children;
    const disclosure = line.children[0];
    const value = line.children[1];
    disclosure.click();

    expect(value.textContent).toContain('\n');
    expect(
      value.children.some((token) => token.className.endsWith('--key')),
    ).toBe(true);
  });
});
