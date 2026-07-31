/**
 * Measures the edit distance between two strings: the fewest single-character
 * insertions, deletions or substitutions that turn one into the other.
 *
 * This is what "did you mean…?" is built on — rank the known commands by their
 * distance from what was typed and suggest the nearest — and what fuzzy
 * matching, spell checking and de-duplicating near-identical records all reduce
 * to.
 *
 * Characters are counted as code points rather than as UTF-16 units, so an
 * emoji or any character outside the Basic Multilingual Plane is one edit and
 * not two. Combining marks are still separate characters: `'é'` written as `e`
 * plus a combining acute is two, and one edit from `'e'`. Normalising the
 * inputs first is the way to compare what a reader would see.
 *
 * The result is symmetric — the distance from `a` to `b` is the distance from
 * `b` to `a` — and is never more than the length of the longer string.
 *
 * The cost is proportional to the product of the two lengths, which is fine for
 * words and identifiers but not for documents. Only two rows of the matrix are
 * held, so the memory is proportional to the shorter string alone.
 *
 * @param {string} a The first string.
 * @param {string} b The second string.
 * @returns {number} The number of edits between them.
 *
 * @example
 * levenshtein('kitten', 'sitting') //=> 3
 *
 * @example
 * levenshtein('abc', 'abc') //=> 0
 *
 * @example
 * // Ranking suggestions by distance
 * sortBy(commands, (cmd) => levenshtein(cmd, input))[0]
 */
export default function levenshtein(a = '', b = ''): number {
  if (a === b) {
    return 0;
  }

  let source = [...a];
  let target = [...b];

  if (source.length === 0) {
    return target.length;
  }

  if (target.length === 0) {
    return source.length;
  }

  // The row held is as long as `target`, so making that the shorter of the two
  // bounds the memory by the shorter string. The distance is symmetric, so
  // swapping them cannot change the answer.
  if (target.length > source.length) {
    [source, target] = [target, source];
  }

  const width = target.length;
  let prev = new Array<number>(width + 1);
  let cur = new Array<number>(width + 1);

  // Row zero: turning an empty prefix of `source` into each prefix of `target`
  // takes one insertion per character.
  for (let j = 0; j <= width; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= source.length; i++) {
    cur[0] = i;

    for (let j = 1; j <= width; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;

      cur[j] = Math.min(
        prev[j] + 1, // delete from source
        cur[j - 1] + 1, // insert from target
        prev[j - 1] + cost, // substitute, or keep
      );
    }

    [prev, cur] = [cur, prev];
  }

  return prev[width];
}
