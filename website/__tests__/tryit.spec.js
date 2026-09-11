import '../test.setup.js';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { seedFromExample } from '../app/components/runner/seed.js';
import mountTryIt from '../app/components/runner/tryit.js';

class Element {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.children = [];
    this.parentNode = null;
    this.hidden = false;
    this._textContent = '';
    this.listeners = new Map();
  }

  set className(value) {
    this.attributes.set('class', value);
  }

  get className() {
    return this.attributes.get('class') ?? '';
  }

  set textContent(value) {
    this._textContent = value;
  }

  get textContent() {
    return this.children.length
      ? this.children.map((child) => child.textContent).join('')
      : this._textContent;
  }

  get nextElementSibling() {
    const siblings = this.parentNode?.children ?? [];
    return siblings[siblings.indexOf(this) + 1] ?? null;
  }

  get previousElementSibling() {
    const siblings = this.parentNode?.children ?? [];
    return siblings[siblings.indexOf(this) - 1] ?? null;
  }

  get isConnected() {
    return this._connected === true || this.parentNode?.isConnected === true;
  }

  append(...children) {
    for (const child of children) {
      child.remove();
      child.parentNode = this;
      this.children.push(child);
    }
  }

  replaceChildren(...children) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    this._textContent = '';
    this.append(...children);
  }

  insertBefore(child, before) {
    child.remove();
    child.parentNode = this;
    const at = before ? this.children.indexOf(before) : -1;
    this.children.splice(at < 0 ? this.children.length : at, 0, child);
  }

  remove() {
    if (!this.parentNode) return;
    const siblings = this.parentNode.children;
    siblings.splice(siblings.indexOf(this), 1);
    this.parentNode = null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const parts = selector.split(/\s+/).map(parseSelector);
    const matches = [];
    const visit = (node, depth) => {
      for (const child of node.children) {
        if (matchesSelector(child, parts[depth])) {
          if (depth === parts.length - 1) matches.push(child);
          else visit(child, depth + 1);
        }
        visit(child, depth);
      }
    };
    visit(this, 0);
    return matches;
  }
}

function parseSelector(selector) {
  const [, tag = '', id = '', classes = ''] =
    /^(?:([\w-]+))?(?:#([\w-]+))?((?:\.[\w-]+)*)$/.exec(selector);
  return {
    tag: tag.toUpperCase(),
    id,
    classes: classes.split('.').filter(Boolean),
  };
}

function matchesSelector(element, { tag, id, classes }) {
  return (
    (!tag || element.tagName === tag) &&
    (!id || element.attributes.get('id') === id) &&
    classes.every((name) => element.className.split(/\s+/).includes(name))
  );
}

class Document {
  constructor() {
    this.documentElement = new Element('html');
    this.documentElement._connected = true;
    this.body = new Element('body');
    this.documentElement.append(this.body);
  }

  createElement(tagName) {
    return new Element(tagName);
  }

  querySelector(selector) {
    return this.documentElement.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.documentElement.querySelectorAll(selector);
  }
}

globalThis.document = new Document();

function el(tagName, attributes = {}, text = '') {
  const node = document.createElement(tagName);
  for (const [name, value] of Object.entries(attributes)) {
    if (name === 'class') node.className = value;
    else node.setAttribute(name, value);
  }
  node.textContent = text;
  return node;
}

function mountHost() {
  const host = el('div', { id: 'host' });
  document.body.replaceChildren(host);
  return host;
}

const section = () => document.querySelector('.rn-tryit');
const sample = () => document.querySelector('.rn-preview')?.textContent;

function page(source) {
  const block = el('web-internal-code-block');
  block.append(el('pre', {}, `\n${source}\n`));
  document.body.replaceChildren(el('h2', { id: 'try-it' }, 'Try it'), block);
}

describe('mountTryIt — direct source', () => {
  test('adds a Try it section with the given source', () => {
    const host = mountHost();
    mountTryIt(host, 'chunk([1, 2], 1) //=> [[1], [2]]');

    expect(section().hidden).toBe(false);
    expect(section().querySelector('h2').textContent).toBe('Try it');
    expect(sample()).toBe('console.log(chunk([1, 2], 1)); //=> [[1], [2]]\n');
  });

  test('includes the import header when present', () => {
    const host = mountHost();
    const source =
      "import { chunk } from '@opentf/std';\n\nchunk([1, 2]) //=> [[1], [2]]";
    mountTryIt(host, source);

    expect(sample()).toContain("import { chunk } from '@opentf/std';");
    expect(sample()).toContain('console.log(chunk([1, 2]));');
  });

  test('hides itself when source is empty', () => {
    const host = mountHost();
    mountTryIt(host, '');
    expect(section().hidden).toBe(true);
  });

  test('offers Run and Reset beside the editor', () => {
    const host = mountHost();
    mountTryIt(host, 'first([1]) //=> 1');

    const buttons = [...section().querySelectorAll('.rn-side .rn-btn')];
    expect(buttons.map((b) => b.textContent)).toEqual(['Run', 'Reset']);
  });

  test('keeps the sample and its output out of the search index', () => {
    const host = mountHost();
    mountTryIt(host, 'first([1]) //=> 1');
    expect(section().hasAttribute('data-pagefind-ignore')).toBe(true);
  });

  test('update is a no-op in direct mode', () => {
    const host = mountHost();
    const view = mountTryIt(host, 'first([1]) //=> 1');
    const before = sample();
    view.update();
    expect(sample()).toBe(before);
  });

  test('keeps only the latest editor when mounted again', () => {
    const host = mountHost();
    mountTryIt(host, 'first([1]) //=> 1');
    mountTryIt(host, 'last([1, 2]) //=> 2');

    expect(document.querySelectorAll('.rn-tryit')).toHaveLength(1);
    expect(sample()).toBe('console.log(last([1, 2])); //=> 2\n');
  });
});

describe('mountTryIt — documentation page', () => {
  test('uses the authored heading and its simple example', () => {
    page('first([1, 2]) //=> 1');
    mountTryIt(undefined, document);

    expect(document.querySelectorAll('h2#try-it')).toHaveLength(1);
    expect(section().previousElementSibling.tagName).toBe(
      'WEB-INTERNAL-CODE-BLOCK',
    );
    expect(sample()).toBe('console.log(first([1, 2])); //=> 1\n');
  });

  test('moves and re-seeds the editor after a page navigation', () => {
    page('first([1]) //=> 1');
    const view = mountTryIt(undefined, document);

    page('last([1, 2]) //=> 2');
    view.update();

    expect(section().previousElementSibling.tagName).toBe(
      'WEB-INTERNAL-CODE-BLOCK',
    );
    expect(sample()).toBe('console.log(last([1, 2])); //=> 2\n');
  });

  test('does not create a section on pages without a Try it example', () => {
    document.body.replaceChildren(el('h2', { id: 'examples' }, 'Examples'));
    const view = mountTryIt(undefined, document);

    expect(view.section.hidden).toBe(true);
    expect(view.section.isConnected).toBe(false);
  });
});

describe('seedFromExample — TypeScript stripping', () => {
  test('removes type annotations from variable declarations', () => {
    const result = seedFromExample('const o: any = {};\n');
    expect(result).toBe('const o = {};');
  });

  test('removes generic type parameters from function calls', () => {
    const result = seedFromExample("const user = tryParseJSON<User>('{}');\n");
    expect(result).toBe("const user = tryParseJSON('{}');");
  });

  test('removes type assertions', () => {
    const result = seedFromExample('tryParseJSON(null as any, []) //=> []\n');
    expect(result).toBe('console.log(tryParseJSON(null, [])); //=> []');
  });

  test('removes non-null assertions', () => {
    const result = seedFromExample(
      'localStorage.setItem("user", tryStringifyJSON(user, "{}")!);\n',
    );
    expect(result).toBe(
      'localStorage.setItem("user", tryStringifyJSON(user, "{}"));',
    );
  });

  test('removes type definitions', () => {
    const result = seedFromExample(
      'type User = { id: string; name: string };\n' +
        "const user = tryParseJSON<User>('{}');\n",
    );
    expect(result).toBe("const user = tryParseJSON('{}');");
  });

  test('removes declare statements', () => {
    const result = seedFromExample(
      'declare const maybe: unknown;\n' +
        'if (isJSONValue(maybe)) {\n' +
        '  console.log(maybe);\n' +
        '}\n',
    );
    expect(result).toContain('if (isJSONValue(maybe))');
    expect(result).not.toContain('declare');
  });

  test('removes arrow function parameter types', () => {
    const result = seedFromExample(
      'const fn = (k: string, v: unknown) => v;\n',
    );
    expect(result).toBe('const fn = (k, v) => v;');
  });

  test('does not strip "as" inside strings or words', () => {
    const result = seedFromExample('"class" //=> "class"\n');
    expect(result).toBe('console.log("class"); //=> "class"');
  });
});
