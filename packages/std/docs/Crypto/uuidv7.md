# uuidv7

Generates a time-sortable UUID v7.

Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
in Node-compatible environments.

### Example

```js
uuidv7() //=> '018f1234-5678-7000-8000-123456789abc'
```
