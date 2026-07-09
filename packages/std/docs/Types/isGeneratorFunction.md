# isGeneratorFunction

Checks if the given value is a generator function.

### Example

```js

isGeneratorFunction(function() {}) //=> false

isGeneratorFunction(function*() {}) //=> true

isGeneratorFunction(async function*() {}) //=> false
```
