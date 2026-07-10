# formatBytes

Formats a number of bytes into a human-readable string.

@param {number} bytes The number of bytes.
@param {object} options The options object.
@param {number} options.decimals The number of decimal places (default 2).
@param {boolean} options.binary If true, use 1024 as base (KiB); otherwise 1000 (KB) (default true).
@returns {string} The formatted string with appropriate unit.

`options.decimals` must be an integer between `0` and `100`.

Values smaller than `1` byte stay in the `B` unit instead of overflowing to an
invalid smaller unit.

### Example

```js
formatBytes(0) //=> '0 B'
formatBytes(1023) //=> '1023 B'
formatBytes(1024) //=> '1 KiB'
formatBytes(0.5) //=> '0.5 B'
formatBytes(1234567) //=> '1.18 MiB'
formatBytes(1234567, { decimals: 0 }) //=> '1 MiB'
formatBytes(1000, { binary: false }) //=> '1 KB'
```
