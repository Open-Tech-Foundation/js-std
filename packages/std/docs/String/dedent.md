# dedent

Removes the common leading indentation from every line of a string.

A template literal inside an indented block carries that indentation into the
string, so an SQL query, a help message or a fixture written where it is used
comes out with the surrounding code's whitespace in it. The alternative is to
unindent the literal to the left margin, which makes the code harder to read to
keep the string right. This does it the other way round.

The smallest indentation of any non-blank line is removed from all of them.
Relative indentation is therefore preserved: a nested clause stays nested. Blank
lines are ignored when measuring — one is often left with no whitespace at all
by an editor trimming it, and counting it would remove nothing from anything —
and are emptied rather than sliced, since a blank line's whitespace is only ever
trailing.

A leading newline and a trailing line of only whitespace are dropped, since both
are artefacts of putting the opening and closing backticks on their own lines
rather than content anyone meant.

Indentation is compared as a count of leading spaces and tabs, so a block
indented with a mixture of the two may not line up the way it looks. Consistent
indentation is measured exactly.

@param {string} str The string to dedent.
@returns {string} The string with its common indentation removed.

### Example

```js
dedent(`
    SELECT *
      FROM users
     WHERE id = 1
`)
//=> 'SELECT *\n  FROM users\n WHERE id = 1'

dedent('  a\n    b') //=> 'a\n  b'
```
