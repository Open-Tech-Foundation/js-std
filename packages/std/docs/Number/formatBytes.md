# formatBytes

Formats a number of bytes into a human-readable string.

@param {number} bytes The number of bytes.
@param {object} options The options object.
@param {number} options.decimals The number of decimal places (default 2).
@param {boolean} options.binary If true, use 1024 as base (KiB); otherwise 1000 (KB) (default true).
@returns {string} The formatted string with appropriate unit.

### Example

```js
formatBytes(0) //=> '0 B'
formatBytes(1023) //=> '1023 B'
formatBytes(1024) //=> '1 KiB'
formatBytes(1234567) //=> '1.18 MiB'
formatBytes(1234567, { decimals: 0 }) //=> '1 MiB'
formatBytes(1000, { binary: false }) //=> '1 KB'
```
