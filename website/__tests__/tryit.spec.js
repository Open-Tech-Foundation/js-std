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

import mountTryIt from '../app/components/runner/tryit.js';

/**
 * The shape a function page has after the build: a Syntax block holding the
 * import, then the example blocks the MDX fences compiled to.
 */
function page({ syntax = "import { chunk } from '@opentf/std';", examples }) {
  const block = (code) =>
    `<web-internal-code-block><div class="otfw-code"><pre>\n${code}\n</pre></div></web-internal-code-block>`;

  document.body.innerHTML = `
    ${syntax ? `<h2 id="syntax">Syntax</h2>${block(syntax)}` : ''}
    ${examples.length ? '<h2 id="examples">Examples</h2>' : ''}
    ${examples.map(block).join('\n')}
    <h2 id="related">Related</h2>
    <div id="host"></div>
  `;
  return document.querySelector('#host');
}

const section = () => document.querySelector('.rn-tryit');
const sample = () => document.querySelector('.rn-preview').textContent;

describe('mountTryIt', () => {
  test('adds a Try it section seeded from the page', () => {
    const host = page({ examples: ['chunk([1, 2], 1) //=> [[1], [2]]'] });
    mountTryIt(host, document);

    expect(section().hidden).toBe(false);
    expect(section().querySelector('h2').textContent).toBe('Try it');
    expect(sample()).toBe(
      "import { chunk } from '@opentf/std';\n\n" +
        'console.log(chunk([1, 2], 1)); //=> [[1], [2]]\n',
    );
  });

  test('carries every example on the page into one sample', () => {
    const host = page({
      examples: ['const c = [1, 2];', 'first(c) //=> 1'],
    });
    mountTryIt(host, document);

    expect(sample()).toContain('const c = [1, 2];');
    expect(sample()).toContain('console.log(first(c));');
  });

  test('hides itself on a page with no examples', () => {
    const host = page({ examples: [] });
    mountTryIt(host, document);
    expect(section().hidden).toBe(true);
  });

  test('offers Run and Reset beside the editor', () => {
    const host = page({ examples: ['first([1]) //=> 1'] });
    mountTryIt(host, document);

    const buttons = [...section().querySelectorAll('.rn-side .rn-btn')];
    expect(buttons.map((b) => b.textContent)).toEqual(['Run', 'Reset']);
  });

  test('keeps the sample and its output out of the search index', () => {
    const host = page({ examples: ['first([1]) //=> 1'] });
    mountTryIt(host, document);
    expect(section().hasAttribute('data-pagefind-ignore')).toBe(true);
  });

  test('re-seeds when the reader moves to another page', () => {
    const host = page({ examples: ['first([1]) //=> 1'] });
    const view = mountTryIt(host, document);
    expect(sample()).toContain('first([1])');

    document.querySelector(
      'web-internal-code-block:last-of-type pre',
    ).textContent = '\nlast([1, 2]) //=> 2\n';
    view.update();

    expect(sample()).toContain('console.log(last([1, 2]));');
  });

  // The section used to hide itself for good when it was built before the
  // page's content had rendered, which is the order a client-side navigation
  // arrives in.
  test('appears once the page it was built ahead of has rendered', () => {
    const host = page({ examples: [] });
    const view = mountTryIt(host, document);
    expect(section().hidden).toBe(true);

    // Keep the section across the page swap, as the layout does.
    const built = section();
    page({ examples: ['first([1]) //=> 1'] }).append(built);
    view.update();

    expect(section().hidden).toBe(false);
    expect(sample()).toContain('console.log(first([1]));');
  });

  test('falls back to no import when the page states none', () => {
    const host = page({ syntax: '', examples: ['first([1]) //=> 1'] });
    mountTryIt(host, document);
    expect(sample()).toBe('console.log(first([1])); //=> 1\n');
  });
});
