# Decimal

A precision decimal arithmetic class that avoids floating-point errors by using BigInt internally for exact integer arithmetic.

### Constructor

```js
new Decimal(value)
```

- `value` (`number | string | Decimal`): The initial value.

**Throws:** For `NaN`, `Infinity`, `''`, `'abc'`, `'1.2.3'`, `'3.'`, `'1,000.50'`.

### Methods

**Representation:**
- `toString()` — Exact string representation
- `toNumber()` — Converts to JS native number ⚠️ loses precision beyond `Number.MAX_SAFE_INTEGER`
- `toFixed(dp)` — String with `dp` decimal places (rounds half-up)
- `toJSON()` — Returns string (JSON produces `{"price":"1.99"}`, not `{"price":1.99}`)

**Arithmetic:**
- `add(other)` — Exact addition
- `subtract(other)` — Exact subtraction
- `multiply(other)` — Exact multiplication
- `divide(other, dp?)` — Division with configurable precision (default 20). Throws on div by zero
- `modulo(other)` — Truncated remainder (matches JS `%`). Throws on mod by zero
- `negate()` — Flip sign. `negate('0')` → `'0'`, not `'-0'`
- `abs()` — Absolute value

**Comparison:**
- `equals(other)` — Exact equality. `'0'.equals('-0')` → `true`
- `greaterThan(other)` — `a > b`
- `lessThan(other)` — `a < b`
- `greaterThanOrEqual(other)` — `a >= b`
- `lessThanOrEqual(other)` — `a <= b`
- `compareTo(other)` — Returns `-1`, `0`, or `1`

**Rounding:**
- `round(dp?)` — Rounds to `dp` decimal places (default 0), half-up
- `floor()` — Rounds toward negative infinity (`-1.1` → `-2`)
- `ceil()` — Rounds toward positive infinity (`-1.1` → `-1`)
- `truncate()` — Truncates toward zero (`-1.9` → `-1`)

**Introspection:**
- `isZero()` — `true` for `0` and `-0`
- `isNegative()` — `true` if value is `< 0` (`false` for `0`, `-0`)
- `isPositive()` — `true` if value is `> 0` (`false` for `0`)
- `isInteger()` — `true` if no fractional part
- `decimalPlaces()` — Number of digits after decimal point

**Coercion:**
- `valueOf()` / `Symbol.toPrimitive` — Enable operators (`+d`, `d * 2`, `d > 1`) via JS number. Prefer method chaining for precision-sensitive code.

### Example

```js
new Decimal('0.1').add('0.2').toString() //=> '0.3'
new Decimal('0.3').subtract('0.1').toString() //=> '0.2'
new Decimal('0.1').multiply('0.1').toString() //=> '0.01'
new Decimal('1').divide('3', 10).toString() //=> '0.3333333333'
new Decimal('2.5').round().toString() //=> '3'
new Decimal('-7').modulo('3').toString() //=> '-1'
```
