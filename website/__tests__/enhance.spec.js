import { enhanceExamples } from '../app/components/runner/enhance.js';

/**
 * The shape a documentation page has after the build: an `Examples` heading
 * followed by the code blocks the MDX fences compiled to, with a `Syntax` block
 * above them that must be left alone.
 */
function page(examples, { syntax = true } = {}) {
  const block = (code) =>
    `<web-internal-code-block><div class="otfw-code"><pre>\n${code}\n</pre></div></web-internal-code-block>`;

  document.body.innerHTML = `
    ${syntax ? '<h2 id="syntax">Syntax</h2>' : ''}
    ${syntax ? block('chunk(arr, size)') : ''}
    <h2 id="examples">Examples</h2>
    ${examples.map(block).join('\n')}
    <h2 id="related">Related</h2>
  `;
  return [...document.querySelectorAll('web-internal-code-block')];
}

const toolbars = () => document.querySelectorAll('.rn-bar');

describe('enhanceExamples', () => {
  test('adds a toolbar to each example block', () => {
    page(['first([1])', 'last([1, 2])']);
    expect(enhanceExamples(document)).toBe(2);
    expect(toolbars()).toHaveLength(2);
  });

  test('leaves the syntax block alone', () => {
    const blocks = page(['first([1])']);
    enhanceExamples(document);
    expect(blocks[0].querySelector('.rn-bar')).toBeNull();
    expect(blocks[1].querySelector('.rn-bar')).not.toBeNull();
  });

  test('does nothing on a page with no examples', () => {
    document.body.innerHTML = '<h2 id="syntax">Syntax</h2>';
    expect(enhanceExamples(document)).toBe(0);
  });

  test('skips an empty block', () => {
    page(['   ']);
    enhanceExamples(document);
    expect(toolbars()).toHaveLength(0);
  });

  test('wires a block only once, however often it is called', () => {
    page(['first([1])']);
    enhanceExamples(document);
    enhanceExamples(document);
    expect(toolbars()).toHaveLength(1);
  });

  test('keeps the output panel out of the search index', () => {
    page(['first([1])']);
    enhanceExamples(document);
    const output = document.querySelector('.rn-out');
    expect(output.hasAttribute('data-pagefind-ignore')).toBe(true);
    expect(output.hidden).toBe(true);
  });

  test('swaps the highlighted block for an editor on request, and back', () => {
    const [, block] = page(['first([1])']);
    enhanceExamples(document);

    block.querySelector('.rn-bar .rn-btn:nth-child(2)').click();
    const editor = block.querySelector('.rn-editor');
    expect(editor.value).toBe('first([1])');
    expect(block.querySelector('pre').hidden).toBe(true);

    block.querySelector('.rn-bar .rn-btn:nth-child(3)').click();
    expect(block.querySelector('.rn-editor')).toBeNull();
    expect(block.querySelector('pre').hidden).toBe(false);
  });
});
