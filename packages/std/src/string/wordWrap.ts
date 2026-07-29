import stringWidth from './stringWidth';
import { ANSI_REGEX } from './stripANSI';
import validateStringCount from './validateStringCount';

export interface WordWrapOptions {
  /**
   * Break a word that is wider than `width` instead of letting it overrun.
   * Off by default, matching the usual convention — a URL or a hash stays in
   * one piece and the line simply runs long.
   */
  hard?: boolean;
}

/**
 * Wraps text to a column width, breaking at whitespace.
 *
 * Width is measured with `stringWidth`, so ANSI escapes cost nothing, CJK and
 * emoji count as two columns, and a grapheme is never split down the middle.
 * That is what makes the result line up in a terminal, which counting
 * `String.length` does not.
 *
 * Each input line is wrapped on its own, so blank lines and paragraph breaks
 * survive. Leading whitespace on a line is kept, so an indented block stays
 * indented; continuation lines are not indented to match. The whitespace run at
 * a break is consumed by the newline, and no output line has trailing
 * whitespace. Line endings are normalised to `\n`.
 *
 * @param {string} str The text to wrap.
 * @param {number} [width=80] The maximum column width. Must be a positive integer.
 * @param {WordWrapOptions} [options] Wrapping options.
 * @param {boolean} [options.hard=false] Break words wider than `width`.
 * @returns {string} The wrapped text.
 *
 * @example
 * wordWrap('the quick brown fox', 10)
 * //=> 'the quick\nbrown fox'
 */
export default function wordWrap(
  str: string,
  width = 80,
  options: WordWrapOptions = {},
): string {
  validateStringCount(width, 'Width');

  if (width < 1) {
    throw new RangeError('Width must be greater than or equal to 1.');
  }

  if (typeof str !== 'string' || str === '') {
    return '';
  }

  const { hard = false } = options;
  const out: string[] = [];

  for (const line of str.split(/\r\n|\r|\n/)) {
    wrapLine(line, width, hard, out);
  }

  return out.join('\n');
}

/** Splits a line into runs of whitespace and runs of everything else. */
function tokenize(line: string): string[] {
  return line.match(/\s+|\S+/g) ?? [];
}

/**
 * Splits a word into the pieces a break may fall between: an ANSI escape
 * sequence is one piece and contributes no width, and everything else is
 * segmented into graphemes so a break never lands inside one.
 */
function segment(word: string): string[] {
  const pieces: string[] = [];
  let index = 0;

  ANSI_REGEX.lastIndex = 0;

  for (const match of word.matchAll(ANSI_REGEX)) {
    pieces.push(...graphemes(word.slice(index, match.index)));
    pieces.push(match[0]);
    index = match.index + match[0].length;
  }

  pieces.push(...graphemes(word.slice(index)));

  return pieces.filter((piece) => piece !== '');
}

function graphemes(str: string): string[] {
  if (str === '') {
    return [];
  }

  // Splitting only ever runs on `hard`, and only on a word that has to break,
  // so the segmenter is built rarely rather than per word.
  if (globalThis.Intl?.Segmenter) {
    return Array.from(
      new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(str),
      (entry) => entry.segment,
    );
  }

  // Without segmentation, code points are the finest safe split — a surrogate
  // pair still stays whole, though a combining mark may part from its base.
  return Array.from(str);
}

function isWhitespace(token: string): boolean {
  return /^\s/.test(token);
}

function wrapLine(
  line: string,
  width: number,
  hard: boolean,
  out: string[],
): void {
  const tokens = tokenize(line);

  if (tokens.length === 0) {
    out.push('');
    return;
  }

  let parts: string[] = [];
  let lineWidth = 0;
  let isFirst = true;
  // Whitespace is held back until a word follows it, so a run that lands on a
  // break is dropped rather than left dangling at the end of a line.
  let pending = '';
  let pendingWidth = 0;

  const flush = (): void => {
    out.push(parts.join(''));
    parts = [];
    lineWidth = 0;
    isFirst = false;
    pending = '';
    pendingWidth = 0;
  };

  for (const token of tokens) {
    if (isWhitespace(token)) {
      // Indentation is worth keeping on the line the author wrote it on, but
      // reproducing it on every continuation line is not what wrapping means.
      if (parts.length === 0 && !isFirst) {
        continue;
      }

      pending += token;
      pendingWidth += stringWidth(token);
      continue;
    }

    let word = token;
    let wordWidth = stringWidth(word);

    if (parts.length > 0 && lineWidth + pendingWidth + wordWidth > width) {
      flush();
    }

    if (pending !== '') {
      parts.push(pending);
      lineWidth += pendingWidth;
      pending = '';
      pendingWidth = 0;
    }

    if (hard) {
      while (lineWidth + wordWidth > width) {
        const room = width - lineWidth;
        const [head, tail, headWidth] = splitToWidth(
          word,
          room,
          lineWidth === 0,
        );

        if (head === '') {
          // Nothing fits in what is left of this line, but the line already has
          // content — start a fresh one and try again against the full width.
          flush();
          continue;
        }

        parts.push(head);
        lineWidth += headWidth;

        word = tail;
        wordWidth = stringWidth(word);

        // The whole word landed on this line, so it stays open for whatever
        // follows. Breaking here would end it and leave an empty remainder.
        if (word === '') {
          break;
        }

        flush();
      }
    }

    parts.push(word);
    lineWidth += wordWidth;
  }

  out.push(parts.join(''));
}

/**
 * Takes as much of `word` as fits in `room` columns.
 *
 * `force` makes it take at least one piece even when that overruns, which is
 * what stops a double-width character from stalling a one-column line forever.
 *
 * @returns The head, the remainder, and the width of the head.
 */
function splitToWidth(
  word: string,
  room: number,
  force: boolean,
): [string, string, number] {
  const pieces = segment(word);
  let head = '';
  let headWidth = 0;

  for (const piece of pieces) {
    const pieceWidth = stringWidth(piece);

    // Forcing applies only while nothing visible has been taken, so exactly one
    // character can overrun — enough to make progress, never more. Zero-width
    // pieces (escape sequences) never overrun and so are always taken.
    if (headWidth + pieceWidth > room && !(force && headWidth === 0)) {
      break;
    }

    head += piece;
    headWidth += pieceWidth;
  }

  return [head, word.slice(head.length), headWidth];
}
