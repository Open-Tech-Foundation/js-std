# constantCase

Converts string to CONSTANT_CASE.

This is `snakeCase` in upper case, the spelling environment variables and
action type constants use.

@param {string} str The string to convert.
@returns {string} The CONSTANT_CASEd string.

### Example

```js

constantCase('Foo Bar') //=> 'FOO_BAR'

constantCase('fooBar') //=> 'FOO_BAR'

constantCase('--foo-bar--') //=> 'FOO_BAR'
```
