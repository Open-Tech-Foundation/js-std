import { dedent } from '../../src';

describe('String > dedent', () => {
  test('removes the common indentation', () => {
    expect(dedent('    a\n    b')).toBe('a\nb');
  });

  test('preserves relative indentation', () => {
    expect(dedent('  a\n    b\n  c')).toBe('a\n  b\nc');
  });

  test('drops the leading newline and trailing blank line of a template', () => {
    const sql = dedent(`
      SELECT *
        FROM users
       WHERE id = 1
    `);

    expect(sql).toBe('SELECT *\n  FROM users\n WHERE id = 1');
  });

  test('keeps interior blank lines, emptied', () => {
    expect(dedent('    a\n\n    b')).toBe('a\n\nb');
    expect(dedent('    a\n   \n    b')).toBe('a\n\nb');
  });

  test('ignores blank lines when measuring', () => {
    // The blank line holds no whitespace at all; counting it as zero would
    // leave every other line indented.
    expect(dedent('    a\n\n    b')).toBe('a\n\nb');
  });

  test('leaves a string that is already at the margin', () => {
    expect(dedent('a\n  b')).toBe('a\n  b');
    expect(dedent('a')).toBe('a');
  });

  test('handles a single line', () => {
    expect(dedent('    a')).toBe('a');
    expect(dedent('  ')).toBe('');
  });

  test('handles an empty string and no argument', () => {
    expect(dedent('')).toBe('');
    expect(dedent()).toBe('');
  });

  test('handles a string of only blank lines', () => {
    expect(dedent('\n\n')).toBe('');
    expect(dedent('   \n   ')).toBe('');
  });

  test('measures tabs and spaces alike, as characters', () => {
    expect(dedent('\t\ta\n\t\tb')).toBe('a\nb');
    expect(dedent('\ta\n\t\tb')).toBe('a\n\tb');
  });

  test('does not touch trailing whitespace on a non-blank line', () => {
    expect(dedent('  a  \n  b')).toBe('a  \nb');
  });

  test('does not touch whitespace inside a line', () => {
    expect(dedent('  a  b\n  c')).toBe('a  b\nc');
  });

  test('dedents by the least indented line, not the first', () => {
    expect(dedent('      a\n  b\n      c')).toBe('    a\nb\n    c');
  });

  test('keeps a final newline that has content before the closing line', () => {
    // Only one trailing blank line is dropped; a deliberate one survives.
    expect(dedent('  a\n\n')).toBe('a\n');
  });

  test('works on an interpolated template', () => {
    const name = 'Tom';
    const out = dedent(`
      Hello, ${name}.
      Bye.
    `);

    expect(out).toBe('Hello, Tom.\nBye.');
  });
});
