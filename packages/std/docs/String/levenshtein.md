# levenshtein

Measures the edit distance between two strings: the fewest single-character
insertions, deletions or substitutions that turn one into the other.

This is what "did you mean…?" is built on — rank the known commands by their
distance from what was typed and suggest the nearest — and what fuzzy matching,
spell checking and de-duplicating near-identical records all reduce to.

Characters are counted as code points rather than as UTF-16 units, so an emoji
or any character outside the Basic Multilingual Plane is one edit and not two.
Combining marks are still separate characters: `'é'` written as `e` plus a
combining acute is two, and one edit from `'e'`. Normalising the inputs first is
the way to compare what a reader would see.

The result is symmetric — the distance from `a` to `b` is the distance from `b`
to `a` — and is never more than the length of the longer string.

The cost is proportional to the product of the two lengths, which is fine for
words and identifiers but not for documents. Only two rows of the matrix are
held, so the memory is proportional to the shorter string alone.

@param {string} a The first string.
@param {string} b The second string.
@returns {number} The number of edits between them.

### Example

```js
levenshtein('kitten', 'sitting') //=> 3

levenshtein('abc', 'abc') //=> 0

// Ranking suggestions by distance
sortBy(commands, (cmd) => levenshtein(cmd, input))[0]
```
