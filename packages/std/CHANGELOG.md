# @opentf/std

## [Unreleased]

### Security

- Guarded every utility that writes a key it did not choose itself against `__proto__`, `constructor` and `prototype`. The earlier hardening pass covered the path mutators, `merge`, `mergeAll`, `clone` and `mapKeys`, but not the functions that copy a key out of a source object or derive one from a value, so those still let untrusted input choose the prototype of the result. None of them reached `Object.prototype` itself; each replaced the prototype of the object it returned, which is quiet enough to be worse in some ways than the global form — the key is absent from `Object.keys` and from `JSON.stringify`, so a validator or an audit log over the result sees nothing while every inherited value reads back through it.
- `shallowMerge` and `shallowMergeAll` copied with `Object.assign`, which assigns through `[[Set]]`, so an own `__proto__` key — exactly what `JSON.parse` produces for `{"__proto__":{...}}` — ran the accessor on `Object.prototype` and replaced the target's prototype. Merging defaults with an untrusted request body is the ordinary use of these two, which made this the most reachable of the set. They now copy with an internal `safeAssign` that skips unsafe keys and preserves symbol keys and null prototypes.
- `pickBy`, `omitBy` and `mapValues` copied such a key straight through. `pickBy` is usually an allow-list over untrusted input, where failing open loses the whole point of the function.
- `keyBy` made a record whose key field was `__proto__` the prototype of the lookup table, and dropped it from `Object.keys`. `groupBy` found an inherited value at `acc[k]`, skipped the array initialisation and threw `TypeError: acc[k].push is not a function`, so untrusted grouping keys were an unhandled crash. `countBy` counted into an inherited value and produced a string instead of a number, or lost the count entirely.
- `invert` needed the check on the *value*, since values become keys there. `flattenObject` produced a key that, replayed against `set` or `unflattenObject`, named a prototype.
- The path mutators now decide before writing rather than during. Checking segment by segment refused the unsafe write correctly, but only after the branch leading up to it had been built, leaving the caller a half-built path it never asked for; `set`, `toSet`, `unset` and `toUnset` now validate the whole path first and leave the object untouched when they refuse it. `toSet` also no longer deep-clones an object it is about to refuse.
- Fixed `randomInt` for ranges of 2**32 or wider. The rejection bound is computed from `2**32 - 1`, so for those ranges it collapsed to zero and only a drawn value of exactly `0` could leave the loop: the function returned `min` every time, after looping about four billion times to get there. `randomInt(0, 2**32 - 1)` was enough to trigger it. Ranges up to `Number.MAX_SAFE_INTEGER` now draw 64 bits instead, and a wider span is refused rather than hanging.
- Fixed a modulo bias in `randomInt` affecting every call. The rejection test was `val > limit` where `limit` is the largest multiple of the range below `2**32`, which accepts one value too many: the accepted count was never a multiple of the range, so the low end of every range came up slightly more often. The test is now `val >= limit`, and a chi-square test over 60,000 draws guards it.
- `shuffle` drew from `Math.random`, a seeded generator whose output can be predicted from earlier draws, while `sample` alongside it already used the crypto-backed `randomInt`. It now uses the same source. The cost is small — about 13 ms against 9 ms to shuffle 100,000 elements — and the order matters the moment anything is assigned or awarded by it.
- `pick` wrote path segments without the guard the rest of the module applies, so `pick(JSON.parse('{"__proto__":{...}}'), '__proto__')` returned an object whose prototype was the input's payload. It refuses unsafe segments now, like every other writer here.
- Bounded the numeric path segment that decides whether `set` creates an array or an object. `unflattenObject` reads the flat shapes that arrive from form bodies and query strings, so that segment is often untrusted, and `{"a[100000000]": 1}` — eighteen bytes — produced an array whose `length` was a hundred million. The array stays sparse and cheap, but `JSON.stringify` on the result was a 477 MB string, an amplification of about twenty-six million to one. Segments above `MAX_ARRAY_INDEX` now make a plain object keyed by the number, so the value is kept and only the array-ness is dropped. The limit is 10,000, which is low on purpose: it is consulted only when a branch is created, from the first index seen for it, and a flattened array starts at `[0]` — so an array of any size still round trips, and what the limit rules out is the lone large index an attacker sends. Worst-case output from a small input drops from 477 MB to 50 KB.
- `Decimal.divide` validated nothing about `decimalPlaces`: a negative value silently returned `0`, and a large one was taken at face value even though it sets the size of the BigInt being divided rather than an iteration count. It now requires a non-negative integer and caps it at `Decimal.MAX_DECIMAL_PLACES` (1000).
- `escapeHTML` now escapes the backtick as `&#96;`, and `unescapeHTML` reverses it. The backtick is not special in HTML itself, but it ends a template literal, and escaped text is often dropped into one on the way to the page. The docstring also states what the function is and is not enough for: an element body or a quoted attribute, but not a `<script>` or `<style>` block, a URL, an unquoted attribute or an event handler.

### Changed

- Consolidated the prototype-key check onto a single internal helper, renamed `isUnsafePathKey` to `isUnsafeKey` now that it guards ordinary property keys and not only path segments. It had been copy-pasted inline in four places alongside the helper, which is how the functions above came to be missed: adding the guard is now a missing import rather than a silently missing condition. The helper is internal, so the public API is unchanged.

### Documentation

- Generated `docs/` from the JSDoc on each export, with `bun run docs`. The repository documentation had been hand-copied from those comments, and copying had gone wrong in two directions at once: descriptions had drifted from the comment they came from, and 221 of the 309 pages showed readers a raw `@param {T[]} arr` — a tag pasted into markdown, where nothing renders it. The comment sits next to the code and changes with it, so it is now the source and `docs/` the copy.
- 33 pages carry a `<!-- handwritten -->` marker and are left alone, because they say more than one function's comment can — `DateTime`, `Duration` and `Decimal` document many methods on one page, and `pickBy` explains null-prototype handling its comment does not. Their leaked tags were fixed in place instead. The generator also reports prose written below the tags rather than dropping it, which is how a misplaced paragraph in `invert` was found and moved.
- Added a Security page to the documentation site covering how to report a vulnerability, supported versions, scope, and the hardening built into the library. Security disclosures go to `security@opentechf.org`.
- Fixed the page metadata across the site. Eight pages carried `description: "ts"`, scraped from a code fence's language tag because those pages had no intro line at all; they now have one. Thirty more leaked raw markdown link syntax into `description`, `og:description` and `twitter:description`. Every page now has a unique, plain-text title and description.

## [0.17.0] - 2026-08-12

### Changed

- Updated OTF Web framework dependencies (`@opentf/web` to `^0.27.0`, `@opentf/web-docs` to `^0.25.0`, `@opentf/web-cli` to `^1.25.0`) and `@opentf/std` tarball dependency to `0.16.0`.

### Added

- Added reusable `CheckIcon` and `CrossIcon` status icon components for the website documentation, replacing inline status emojis across environmental support and DateTime comparison tables.
- Gave both icons a `<title>`, named by a new `label` prop defaulting to `Yes` and `No`. In several cells the icon is the whole content, so it carries the meaning the emoji used to and a screen reader would otherwise reach an unlabelled graphic. This also clears the `a11y/noSvgWithoutTitle` failures that were breaking `biome check` for the whole repository.
- Added `pollRun`, which runs a function repeatedly until its result satisfies a condition. Waiting for something to become true — a job to leave `'pending'`, a container to report healthy, a deployment to go live — is the one control-flow shape the module did not cover, and writing it by hand means writing the interval, the timeout and the give-up path by hand each time. It is the mirror of `retryRun` rather than a variation on it: `retryRun` repeats on failure, and here a *successful* call whose result is not yet what was wanted is the reason to go round again. An error therefore rejects immediately rather than being swallowed, since a failing call is a real failure and not a `false` in disguise, and the two compose — `pollRun(() => retryRun(check), …)` — where a call may fail transiently and still be worth polling.
- The first attempt runs immediately, so a condition that already holds costs one call and no waiting. `timeout` bounds the whole operation rather than one attempt and holds even while the call itself is running, so a slow call cannot overrun it; a test polls a function that takes five seconds under a hundred-millisecond limit to prove it. Giving up stops the pending wait rather than leaving a timer to fire into a poll nobody is watching, and the abort listener is removed on the way out, since a signal held across many calls would otherwise accumulate one per call.
- Added `limitRun`, a gate that runs at most `n` tasks at a time. `mapAsync` and the rest of the concurrency module already take a limit, but only over one array processed by one callback — a connection pool shared by several different queries, an API budget spent by unrelated parts of a program, or work arriving over time rather than as a list could not be limited at all.
- It is the one function in this module that wraps no particular function, taking a limit and giving back a gate any task can be passed through. That is what the shared-budget case needs, since the point is precisely that unrelated operations draw on one limit, and wrapping a single function is a line on top of it. It is also why this is not the classic `acquire`/`release` semaphore: there is no handle to forget to give back, so a task that throws cannot wedge the gate.
- A finishing task hands its slot straight to the next in line rather than releasing it for whoever asks first. Decrementing and letting the next caller increment leaves a gap of one microtask in which a task submitted from outside sees a slot that is already spoken for — it starts out of turn and puts the gate one over its limit. That window is narrow enough that the obvious tests miss it entirely, so there is one that submits a task at every microtask depth around the handover and checks the limit and the order held at each.
- Added `dedent`, which removes the common leading indentation from every line of a string. A template literal written inside an indented block carries that indentation into the string, so an SQL query, a help message or a fixture comes out with the surrounding code's whitespace in it — and the usual answer is to unindent the literal to the left margin, making the code harder to read to keep the string right. The smallest indentation of any non-blank line is removed from all of them, so relative indentation survives and a nested clause stays nested. Blank lines are ignored when measuring, since one is usually left empty by an editor trimming it and counting it as zero would remove nothing from anything; they are emptied rather than sliced, a blank line's whitespace being only ever trailing. The leading newline and trailing whitespace-only line that a multi-line template always has are dropped, since neither is content anyone meant.
- Added `levenshtein`, the edit distance between two strings: the fewest single-character insertions, deletions or substitutions that turn one into the other. It is what "did you mean…?" is built on, and what fuzzy matching, spell checking and de-duplicating near-identical records all reduce to — none of which the String module could do. Characters are counted as code points rather than UTF-16 units, so an emoji is one edit and not two; the naive implementation gets that wrong and the test says so. Only two rows of the matrix are held, so the memory is bounded by the shorter string rather than by their product, and the answer is checked against the plain full-matrix algorithm over 400 random pairs.
- Added `mapRange`, which re-maps a number from one range to another — the sensor reading that has to become a percentage, a pixel or a volume. It is `lerp` in reverse composed with `lerp` forwards, and neither existed as one step. The ranges are given as pairs rather than as four loose numbers, because four numbers in a row are easy to write in the wrong order and impossible to read back; either may run downwards, so a range is inverted by giving it reversed. The result is deliberately not clamped, since extrapolation is a valid answer and rejecting it is the caller's business — `clamp` composes for that. An empty input range throws a `RangeError` rather than returning the `Infinity` or `NaN` that the division would produce and that would surface somewhere far away.
- Added `binarySearch`, which finds a value in a sorted array in `O(log n)` comparisons rather than the `O(n)` scan `indexOf` performs. Where a value appears more than once the first of them is returned, so the answer does not depend on where the search happened to land — an ordinary binary search returns whichever equal element it met first, which is arbitrary and makes the result a function of the array's length rather than of its contents. It agrees with `indexOf` on every position of every array up to 33 elements and on 60 arrays holding runs of duplicates.
- The sortedness of the array is a precondition rather than something checked, since verifying it would cost the very `O(n)` the function exists to avoid; that is stated outright rather than left implied. The default comparator orders by `<` and `>`, which is what `sort` does, so an array from `sort` needs none — and a comparator decides what counts as a match and not merely the order, which is what lets a descending array or an array of objects be searched at all.
- Added `flattenObject` and `unflattenObject`, which convert between a nested object and a one-level one keyed by the path to each value. The Object module could already read and write a single deep path with `get` and `set`, but not turn a whole structure inside out — so a flat shape arriving from a form body, a query string, an environment map or a dotted configuration file had to be expanded a key at a time by hand. The keys are the same path grammar the rest of the module speaks, so every key `flattenObject` produces can be handed straight back to `get`, `set` or `toPath` against the original.
- Empty objects and arrays are kept as values rather than dropped. They have no leaves to stand for them, and dropping one would lose a key that was present and break the round trip, which a test holds both ways. `unflattenObject` makes a level whose keys are all indices an array — the rule `set` already applies within a path, applied to the root as well, so a flattened array comes back as an array rather than as an object with numeric keys.
- A key already containing a `.` or a `[` cannot be told apart from the path built around it, so `{ 'a.b': 1 }` and `{ a: { b: 1 } }` flatten alike. That is a property of the format rather than of the function, and it is documented rather than papered over with an escape the rest of the module would not understand. `unflattenObject` refuses `__proto__`, `constructor` and `prototype` as path segments, as everything else in this module does: a flat object is very often untrusted input, which is much of the reason the function exists.
- Added `deepFreeze`. `Object.freeze` is shallow — it seals the object it is handed and leaves every nested object writable — so a frozen configuration or fixture was only frozen one level down, which is rarely what was meant. Own properties, array elements and the entries of a `Map` or `Set` are all reached, string and symbol keys alike, and cycles terminate.
- Accessor properties are deliberately not read. Reading one runs it, and a getter is free to treat that as an event or to answer with a fresh object nothing else holds a reference to, which there would be no point freezing. Typed arrays and `DataView`s are skipped rather than frozen: `Object.freeze` throws outright on a non-empty typed array, since its elements sit in a buffer that cannot be made non-configurable, so a structure holding binary data would otherwise fail rather than freeze. What freezing cannot do is stated rather than implied — a `Map`, `Set` or `Date` is frozen as an object, but nothing in JavaScript stops `set`, `add` or `setTime`, and the returned `DeepReadonly` type says so by leaving those alone instead of reporting them readonly.
- Added `isPrimitive` and `isArrayLike`, the two questions the Types module could not answer despite having thirty-one guards. Between them `isObject` and the specific guards left no way to ask the general question either way round: whether a value is one of the seven primitive types, or whether it is a collection that can be indexed.
- `isPrimitive` gets `null` right, which is the entire difficulty — `typeof null` is `'object'` by a mistake old enough to be permanent, so the obvious one-line check is wrong, as it is for functions, which are objects. `isArrayLike` accepts what `Array.from` accepts: a `NodeList`, a `FileList`, `arguments`, a typed array and a string are all indexable without being arrays, and `isArray` rejects every one. `length` must be an integer within the indexable range, so an object carrying an unrelated `length` is not mistaken for a collection, and functions are excluded because their `length` is an arity.
- Added `mapStream` and `filterStream`, the two transforms the Streams module lacked. It could convert a stream and combine streams but not change one, so transforming meant the round trip through the iterator bridge — `iterToStream(mapIterAsync(streamToIter(s), fn))` — three calls for the commonest thing anyone does to a stream. Both are built on the `ReadableStream` constructor rather than `TransformStream`, which the module avoids throughout because it is absent from some runtimes and referring to it would throw at import rather than at use. That was checked rather than assumed: both pass on every runtime in the matrix, LLRT included.
- Cancelling either result cancels its source, and a callback that throws cancels the source before erroring the stream — otherwise the source stays locked with nobody left to read it. Neither drains ahead of the consumer, save for the single chunk any `ReadableStream` keeps queued by default, so backpressure reaches the source and an endless one is safe.
- No `teeStream` was added. `ReadableStream.prototype.tee` is part of the base Streams specification and available wherever `ReadableStream` is, so a wrapper would be a second name for something that already exists.
- Added `quantile`, the statistic the maths module was missing after `mean`, `median`, `mode`, `variance` and `stddev` — the p95 everyone reaches for once a median stops answering the question. `p` runs from `0` to `1`, so a 95th percentile is `quantile(values, 0.95)`, and `0.5` returns exactly what `median` does. A quantile rarely lands on an observation, so the two either side of it are interpolated linearly; that is the default of R, NumPy and Excel's `PERCENTILE.INC` and so the method usually meant, but it is one of nine in common use and the documentation says so rather than leaving a reader to wonder why a figure differs from another tool's on a small sample. Only `quantile` ships and not a `percentile` taking `0` to `100`, since one name per function is the rule here and the two would be the same function twice.
- Added `formatNumber`, the plain case the rest of the number formatters build on. `formatBytes`, `formatCurrency` and `formatCompact` each format a number *as* something, and nothing formatted one as itself — so locale-aware grouping, the decimal mark and simple rounding all had to be done by hand or by reaching past the library to `Intl.NumberFormat`. `style: 'percent'` takes a ratio rather than a number of percent, which is what `Intl` does and the one thing about it worth stating outright.
- Added `formatList`, which joins strings into prose rather than into `'a, b, c'`. The connector, the punctuation before it and the separate form a two-item list takes all differ by language, and none of them are worth hand-rolling. `Intl.ListFormat` is used where the runtime has it and the English forms are produced where it does not, matching how `Duration` treats `Intl.DurationFormat` — so the shape of the output never changes with the host, only the language. The fallback is held to that by a test comparing all forty-five combinations of type, style and list length against the native implementation.
- Added `isUUID`, `isULID`, `uuidv7Time` and `ulidTime`, which close the crypto module's identifier gap in both directions: it could produce three kinds of identifier and neither check one nor read one. Validation is the more common of the two operations — an id arriving from a route parameter, a form or another service has to be checked before it is trusted — and there was nothing to do it with.
- `isUUID` follows RFC 9562 and accepts versions 1 to 8 rather than RFC 4122's 1 to 5, which would have rejected this module's own `uuidv7` output. It checks the version and variant bits rather than only the `8-4-4-4-12` shape, so it does not admit strings no generator produces; a `version` argument narrows it further. The Nil and Max UUIDs are accepted as the two special forms RFC 9562 names, and since neither carries a version, neither satisfies a version filter. Checked against the `uuid` package over 100,000 generated strings: the only disagreements are the versions 6 to 8 and the Max UUID that package predates.
- `isULID` does not merely count characters. The first character is capped at `7`, because ten Base32 characters hold fifty bits where the timestamp is forty-eight and anything above `7ZZZZZZZZZ` would overflow it, and the four letters missing from the alphabet are rejected. Both cases are accepted, since lower-casing identifiers is common, but the I/L/O substitutions Crockford allows a decoder to make are not — a string carrying those is not one this module produced.
- `uuidv7Time` and `ulidTime` read the embedded timestamp back out. Both formats lead with 48 bits of milliseconds and that is the whole reason they sort, but until now the value could not be recovered without knowing the layout — that a v7's timestamp is its first twelve hex digits with a hyphen through the middle, or that a ULID's is ten Base32 characters most-significant-first. Both reject anything of the wrong shape rather than returning a number that would mean nothing, so a creation time can be recovered from an id without having stored one.
- Added `ulid`, a 128-bit lexicographically sortable identifier: a 48-bit millisecond timestamp followed by 80 random bits, encoded as 26 characters of Crockford's Base32. Because the time leads and the encoding preserves order, sorting the strings sorts by creation time — there is nothing to parse and no separate column to keep beside them. It is ten characters shorter than a UUID, carries no hyphens, and survives a URL, a filename and a double-click intact; the alphabet omits `I`, `L`, `O` and `U`, so nothing in it can be read back as a digit or as `V`.
- A ULID is not a UUID and will not pass a UUID column or validator — `uuidv7` is the one to reach for when the shape has to be a UUID, and the two carry the same idea otherwise. `ulid` trades that compatibility for six more random bits and a shorter string.
- Ordering holds between milliseconds rather than within one: two ULIDs made in the same millisecond differ only in their random half, so their relative order is arbitrary. That is what the specification defines for this function, and it is documented rather than left to be discovered by whoever first sorts a batch written in one tick.
- `seedTime` may be passed to encode a known time, which is what makes the function testable at all, and is rejected unless it is an integer inside the 48-bit range. The encoding was checked against the specification's own vector — `ulid(1469918176385)` begins `01ARYZ6S41` — and the random half against every symbol in the alphabet appearing, which is what catches a mask that quietly drops a bit.
- Added `semverDiff`, `semverCoerce`, `semverMaxSatisfying` and `semverMinSatisfying`, which together are most of what remained to install the `semver` package for. Parsing, comparing, sorting, satisfying and incrementing were all here; naming the distance between two versions, salvaging one from a string that is not quite canonical, and picking one out of a list were not.
- `semverDiff` is the inverse of `semverIncrement` — given where you were and where you are, what sort of bump was that. It is not the string comparison it looks like: moving off a pre-release onto its release reports the release that landed rather than `'prerelease'`, so `1.0.0-rc.1` to `1.0.0` is a `'major'`, and a pre-release of an `x.0.0` reports `'major'` however far the release turns out to be from it. The answer describes the distance rather than the direction, so the arguments can be given either way round.
- `semverCoerce` fills in what a loose version leaves out — `v2` becomes `2.0.0`, `node:20.11` becomes `20.11.0` — for the versions that turn up in git tags and image names rather than in a manifest. The result is still put through the parser, so a component with a leading zero yields `null` rather than being quietly renumbered: `007` is not a SemVer component and guessing which one was meant is not the function's job.
- `semverMaxSatisfying` and `semverMinSatisfying` pick the extremes of the versions a range admits, which is what resolving a dependency comes down to. Both return the version exactly as it was given rather than re-formatted, so a `v` prefix survives the round trip, and both order by precedence rather than as strings — the string maximum of `1.2.3` and `1.10.0` is the wrong one.
- All four were checked against the `semver` package rather than against expectations: 88,000 generated cases across the three behaviours — every pairing of a version corpus for `semverDiff`, random junk strings for `semverCoerce`, and random lists and ranges for the other two — agree with it exactly.
- Added `constantCase`, the last missing member of a closed set. `camelCase`, `pascalCase`, `snakeCase`, `kebabCase` and `titleCase` all shipped, and `CONSTANT_CASE` — the spelling of environment variables and action type constants — did not, so it was the one conversion callers had to write themselves. It is `snakeCase` in upper case and shares its word splitting, so `XMLHttpRequest` becomes `XML_HTTP_REQUEST` rather than one run of capitals.
- Added `Json` module with `isJSONValue`, `tryParseJSON` and `tryStringifyJSON`. `isJSON` only told whether a string *was* JSON; getting the value still meant writing `try { JSON.parse } catch {}` at every call site, and `JSON.stringify` throws on `bigint` and circular structures. `isJSONValue` checks whether a value *is* a JSON value (`string`, finite `number`, `boolean`, `null`, arrays and plain objects thereof — `NaN`, `Infinity`, `bigint`, `undefined`, `function`, `symbol`, `Date`, `Map`/`Set` are not). Cyclic values return `false` rather than throwing — a circular structure is not JSON — while shared references are allowed. `tryParseJSON` parses without throwing, returning a `fallback` (or `undefined`) on non-string input or invalid JSON, and supports both a `reviver` function and an options form `{ reviver, temporal }` — with `temporal:true`, ISO 8601 strings revive to `DateTime`/`Duration` (and native `Temporal` where available). `tryStringifyJSON` stringifies without throwing, returning a `fallback` on circular structures or non-serializable top-level values, stringifies `bigint` as decimal strings by default (native `JSON.stringify` throws `TypeError` on `bigint`) — chained before a user `replacer` and respected for array `replacer` as well, with `space` passthrough — and with `temporal:true`, `DateTime`/`Duration` and native `Temporal` (`Instant`, `ZonedDateTime`, `PlainDate`, etc.) are stringified via their ISO `toString()` before `replacer`. `Date` already works via `toJSON` without the flag; this is for the newer `Temporal` family. Three small helpers replace the two extra packages (`safe-json-parse` / `fast-safe-stringify` / `superjson`) otherwise needed for safe JSON boundaries.
- Added `chunkIter`, `zipIter`, `uniqueIter` and `concatIter`, with an `*Async` counterpart for each. The iterator module had forty-two operators and none that grouped, combined or deduplicated — every one of them mapped, filtered or reduced a single source. `chunk`, `zip` and `unique` existed only for arrays, so anything arriving as a stream had to be collected first, which is exactly what the module is for avoiding. The async half is included because the module has had sync and async parity throughout, and adding one side alone would have created the asymmetry this is meant to remove.
- `chunkIter` holds one group at a time, so batching five hundred rows for an insert never materialises the source. `size` is checked when the function is called rather than on the first pull: a generator body does not run until then, so a lazy check would let a bad argument escape the frame that produced it. This is the same reason `iterToStream` validates eagerly, and the check is now shared with `chunk` rather than written out twice.
- `zipIter` runs until every source is exhausted, padding the ones that finished early with `undefined`, which is what `zip` does for arrays rather than what most languages' `zip` does — stopping at the shortest. Sources are advanced exactly once per row and never read ahead, and any still open are closed when the consumer stops early. `zipIterAsync` advances its sources together rather than one after another, so a row costs the slowest of them rather than the sum; zipping streams sequentially would be no better than collecting each one first.
- `uniqueIter` yields items as they are read, so a duplicate-free prefix is available before the source ends — which is what it offers over `unique`. The keys held only grow, as they must for any deduplication. Primitive keys are matched by identity and object keys structurally with `isEql`, matching `unique`, against every distinct object seen so far. That last part is quadratic, so the documentation says to prefer a `by` returning a primitive rather than leaving the cost to be discovered.
- Added `someAsync`, `everyAsync` and `findAsync`, the short-circuiting predicates the concurrency module was missing. It had `mapAsync`, `filterAsync`, `eachAsync`, `flatMapAsync` and `reduceAsync` — every operator that must visit the whole array — while the async iterators next door already had `someIterAsync`, `everyIterAsync` and `findIterAsync`. Arrays were the one place with no way to stop early, so "is any of these reachable?" had to be written as a `filterAsync` that checked all of them. All three take the same `concurrency` argument as the rest of the module.
- Once the answer is settled no further elements are started, but those already running are awaited rather than abandoned: work handed to a callback cannot be recalled, and dropping the promise would only hide whatever it goes on to do. `someAsync` and `everyAsync` skip sparse holes and `findAsync` visits them as `undefined`, which is what `Array.prototype.some`, `every` and `find` respectively do.
- `findAsync` returns the earliest match by index, not the first predicate to resolve. The two coincide only at a concurrency of one; with several in flight a later element can settle first, and returning it would make the result depend on how quick each callback happened to be — the same input would give different answers on a slow network. Elements at or beyond a known match are never started, since they cannot improve on it, but everything before one is awaited because any of those could still turn out to be earlier.
- Exported every type needed to name what a public function takes or returns. The entry re-exported only `WordWrapOptions` and the `DateTime` types, so a caller could not write down the argument to `sort` (`OrderType`), the criteria for `sortBy` (`OrderTuples`, `SortCB`), the result of `semverParse` (`Semver`), the release kind for `semverIncrement` (`SemverRelease`), the accepted colours (`ColorInput`), the guarded type of `isTypedArray` (`TypedArray`) or the options of `stringReplace` (`StringReplaceOptions`). Each was declared and reached the emitted `.d.ts`, but was absent from the export list, so anything wrapping the library had to restate the shape and drift from it. All are now exported by name.
- Named the option objects that were written inline in the signatures, adding `IdleRunOptions`, `PaceRunOptions`, `BatchRunOptions`, `RetryRunOptions`, `TimeoutRunOptions`, `MemoizeRunOptions`, `IsEqlOptions`, `SleepOptions`, `EncodeBase64UrlOptions`, `EncodeBase32Options`, `SemverSatisfiesOptions` and `StreamToIterOptions`. An anonymous `options: { ... }` cannot be referenced at all, so a caller assembling a configuration object before the call had no type to annotate it with, and the members carried no documentation. The shapes are unchanged and structural typing means every existing call site still compiles.
- Named the callable objects the `flow` module returns — `IdleRunFn`, `PaceRunFn` and `MemoizeRunFn` — and the result of `withResolvers`, `PromiseResolvers`. These are the values callers actually store, in a variable, a class field or a component prop, and each was an anonymous intersection of a call signature with `cancel`, `flush` and `pending`. `memoizeRun` had no return annotation at all and relied on inference.
- Added a compile-only test at `__tests__/_types/publicApi.ts` that names every exported type and passes it to the function it belongs to, so an export dropped in a later refactor fails the build rather than the next consumer. It has its own `tsconfig.api.json` and `typecheck:api` task: the rest of `__tests__` hands wrong types to functions deliberately, to exercise their runtime guards, and so cannot be typechecked as a whole.
- Added `stringSplice`, which removes characters from a string and inserts another in their place, following `Array.prototype.splice`. It is the short form of the round trip most code writes by hand — `split('')`, `splice`, `join('')` — without the intermediate array, and it covers insertion, deletion and range replacement in one function: `stringSplice('abcdef', 2, 2, 'XY')` gives `'abXYef'`, a zero `deleteCount` inserts, and an empty `insert` deletes. Omitting `deleteCount` removes everything from `start` onwards and a negative `start` counts back from the end, as with the array method.
- `stringSplice` indices count UTF-16 code units, matching `slice` and `indexOf`, so a position from either — or from a textarea's `selectionStart` — can be passed straight in. A boundary landing inside a surrogate pair is widened to cover the whole character, so the result is always well-formed; `split('')` splits on code units and will cut an emoji in half.

### Removed

- Removed `stringInsertAt` and `stringReplaceAt` in favour of `stringSplice`. `stringInsertAt(str, i, s)` becomes `stringSplice(str, i, 0, s)` and `stringReplaceAt(str, i, s)` becomes `stringSplice(str, i, s.length, s)`. Both sliced on raw UTF-16 indices and so could emit lone surrogates, and `stringReplaceAt` had no way to express the operation callers actually wanted: it overwrote exactly as many characters as the replacement was long, so replacing a four-letter word with a three-letter one left the stray letter behind, and an empty replacement deleted one character rather than none. A `deleteCount` separate from the replacement resolves both.

### Fixed

- Fixed `unique` giving a different answer with an identity iteratee than without one: `unique([0, -0])` was `[0]` but `unique([0, -0], (x) => x)` kept both. The iteratee path compared with `isEql`, where `-0` and `0` differ, while the plain path used a `Set`, where they do not — so deriving a key changed how two keys were compared, which it has no business doing. Both now match primitives by identity and objects structurally, whichever path they take.
- `unique` also invoked the iteratee once per element per element already kept, rather than once per element, so a hundred-element array made thousands of calls into user code. It is now called once each, and the comparison is a lookup rather than a scan whenever the key is a primitive. The rule is shared with `uniqueIter` and `uniqueIterAsync` rather than written out three times, so the three cannot drift apart again.
- Fixed `takeIter` and `takeIterAsync` reading one more item from the source than they yield. The loop pulled a value and only then checked whether it was still wanted, so `takeIter(gen, 2)` ran the generator three times and `takeIter(gen, 0)` — which yields nothing — still pulled one and discarded it. For an iterator library that is the whole point: the source may be expensive, may have a side effect, or may be a request. Exactly `n` items are now read, and none at all for an `n` of zero or less. Found while testing `chunkIter`, whose laziness could not be pinned while `takeIter` over-pulled.
- The website page for `takeIter` documented `n` as defaulting to `1`. There is no default — the parameter is required, and a JavaScript caller omitting it gets every item rather than one. The page now matches the signature.
- Fixed `color` returning `any`. It is the widest-reaching type hole in the package — the flagship function, and one whose result type is entirely decided by the `format` argument — so every call silently disabled checking on whatever it fed. The format is now a generic parameter resolved through a `ColorFormatMap`, so `color(c, 'hex')` is a `string`, `color(c, 'number')` a `number`, and `color(c, 'rgba-object')` an `RGBA`. A format known only to be a `ColorFormat` still yields the union, which is the honest answer there. `RGBA`, `HSLA` and `OKLCH` were private aliases and are now exported, as are `ColorFormatMap` and `ColorOutput`.
- The same treatment applies to the nine derivatives — `colorLighten`, `colorDarken`, `colorSaturate`, `colorDesaturate`, `colorAlpha`, `colorMix`, `colorGrayscale`, `colorRotateHue` and `colorInvert` — which each declared `string | number | object` and so forced a cast at every call. Each ends in `color(x, format)`, so each now returns exactly what `color` returns for that format, defaulting to `'hex'` and therefore `string` when the argument is omitted. `AccessibilityLevel`, which `colorIsReadable` takes, was not exported from its own module and is now.
- Fixed `flatten` returning `any[]` regardless of depth. It now resolves the element type against the depth through the built-in `FlatArray`, exactly as `Array.prototype.flat` does, so `flatten([1, [2, [3]]])` is `(number | number[])[]` and the same call at depth `2` is `number[]`. An unbounded depth still cannot resolve to a single element type, which is a limitation of `flat` itself and not of this wrapper.
- Fixed three signatures whose unions collapsed to `unknown` and so documented nothing. `toPath` declared `string | unknown | unknown[]`, and `set`, `toSet` and `intersperse` declared `unknown | Function` to signal that a function is treated as an updater rather than a value. TypeScript absorbs every member of a union into `unknown`, so all four read as `unknown` to a caller while looking deliberate in the source. The updater forms cannot be expressed as types — a function is a perfectly good value to store — so those parameters now say `unknown` plainly, and the behaviour they were gesturing at is documented and shown in an example instead.
- Fixed `pad` throwing a `RangeError` when given an empty padding string. `chars.length` is then `0`, so `Math.ceil(leftLength / chars.length)` is `Infinity` and `String.prototype.repeat` rejects it. There is nothing to pad with, so the string is now returned unchanged, matching the existing behaviour when it is already at least `length` long.
- Fixed `truncate` returning a string longer than the requested maximum when `omission` did not fit within it — `truncate('hello world', 2)` returned the full `'...'`. The omission is now truncated to `length` itself, so the result never exceeds the maximum the caller asked for.

### Changed

- The runtime matrix now attributes three failures it was reporting as undiagnosed. `formatNumber` joins the existing `Intl.NumberFormat` entry, `zipIterAsync` joins the `IteratorClose` deviation that `fromIterAsync` and `streamToIter` already sit under, and `formatList` gets an `Intl.ListFormat` entry of its own. All three are runtimes lacking a capability rather than anything wrong here, and every LLRT failure is now accounted for.
- The concurrency operators — `mapAsync`, `filterAsync`, `eachAsync`, `flatMapAsync`, `reduceAsync`, `someAsync`, `everyAsync` and `findAsync` — now accept a synchronous callback. Each awaits its callback, so a plain value always worked at run time; only the signatures said otherwise, which meant a caller mixing one cheap predicate in among expensive ones had to mark it `async` for no reason. Widening a return type admits more callbacks than before and rejects none, so no existing call site is affected.
- **Breaking:** `retryRun`'s `onRetry` now receives the error as `unknown` rather than `any`. A rejection can carry any value, not only an `Error`, and `any` let a wrong assumption about it through silently. Under `strictFunctionTypes` a handler annotated `(error: Error) => void` no longer type-checks; widen it to `unknown` and narrow inside, which is what the value warranted all along. This is the only change in this group that can break a compiling call site.
- `toPath` now declares `PropertyPath | number | symbol` instead of the collapsed `unknown`, so passing something it cannot turn into a path is rejected rather than silently yielding `[]`. `PropertyPath` — `string | unknown[]`, the path spelling every accessor already accepted — is exported and now names that parameter across `has`, `get`, `set`, `toSet`, `unset`, `toUnset`, `omit` and `pick`, whose types are otherwise unchanged.
- `stringReplace`'s function replacement is now the exported `StringReplacer`, whose first parameter is the matched substring. The rest stays `any[]` deliberately: the arguments after it are the capture groups, then the offset and the whole input, so no single element type covers them — this is the same shape, and the same compromise, as `String.prototype.replace` in the TypeScript lib.
- The `any` remaining in `idleRun`, `paceRun`, `rateLimitRun`, `batchRun` and `memoizeRun` is confined to the generic constraints — `T extends (...args: any[]) => any` — and is deliberate. It is the idiomatic way to say "any function", and tightening it to `unknown[]` would reject ordinary callbacks rather than make anything safer. No value in the public surface is typed `any` any more.
- Documented that `stringReplaceAt` overwrites exactly as many characters as the replacement is long, rather than replacing whatever word sits at the index, and that an empty replacement removes one character. `stringReplaceAt('I HATE U', 2, 'LUV')` gives `'I LUVE U'`, not `'I LUV U'`: the function is given an index, not a span, so it cannot know where the word ends. Behaviour is unchanged; the tests now pin it.

## [0.16.0] - 2026-07-29

### Added

- Added `Duration`, an immutable length of time. `DateTime` could already apply a duration through `add`/`subtract` and measure one through `diff`, but there was no value type to hold one: no ISO-8601 duration parsing, no way to express a span without collapsing it to a single unit, and nothing to pass around. `Duration` parses and serialises `P1Y2M3DT4H5M6S`, holds calendar and exact units side by side, and compares, negates and combines them.
- Calendar units — years, months, weeks and days — are carried as written and never silently converted, because none has a fixed length: a month is 28 to 31 days and a day across a DST boundary is 23 or 25 hours. Anything needing that conversion takes a `relativeTo` `DateTime` to measure against, and durations of hours and below need no anchor at all. This follows `Temporal.Duration`, which `DateTime` already tracks for 1-based months and ISO `dayOfWeek`.
- Every non-zero field must share one sign, and mixed signs throw a `RangeError`. ISO-8601 signs the duration as a whole and has no way to write "a month minus two hours", so permitting it would make `toString` lossy and leave `sign`, `abs` and `negated` undefined. Arithmetic still resolves across the boundary — adding `-PT90M` to `PT1H` gives `-PT30M` — since the sum has one direction even when the operands could not sit side by side.
- Fields are stored exactly as given rather than balanced, so `PT90S` round-trips as `PT90S` instead of becoming `PT1M30S`. Milliseconds are the one thing that cannot survive a round trip unchanged: ISO-8601 has no millisecond component, so they serialise as the fraction of the seconds field and `{ milliseconds: 1500 }` writes as `PT1.5S`. A fraction on the smallest component of a parsed string cascades into the smaller units, so `PT1.5H` reads back as one hour and thirty minutes and every stored field stays an integer.
- Added `Duration.between(a, b)`, which measures two `DateTime`s against the calendar rather than assuming fixed unit lengths — a day spanning a DST change counts as one day, and the same span in exact units is 23 hours. `largestUnit` sets the coarsest unit and defaults to `'day'`, which keeps the result clear of the ambiguity months and years carry. Weeks are produced only when explicitly asked for, since "two months and two weeks" makes the day field mean something different depending on the month.
- Added `Duration.prototype.total`, which measures the whole duration in one unit including the fraction, and `Duration.prototype.round`, which rounds to a unit and rebalances. Neither needs an anchor while the duration and the unit both stay at hours or below; anything touching a calendar unit takes `relativeTo`. `total` takes the fraction against the unit that actually follows rather than an average one, so half of a 28-day February is not half of a 31-day March, and `P1D` totals 24 hours in UTC but 23 across a spring-forward boundary.
- `round` takes `smallestUnit`, `largestUnit` and `roundingMode`. Giving only `largestUnit` balances without discarding anything, so `PT90S` becomes `PT1M30S`. `halfExpand` — the default — sends a half away from zero in both directions, where `Math.round` would send `-0.5` toward zero and `0.5` away from it. `largestUnit` defaults to the coarsest unit the duration already uses, so rounding does not invent larger ones, but never to something finer than `smallestUnit`.
- Added `Duration.prototype.format`, a locale-independent token formatter in the mould of `DateTime.format`, so a pattern produces the same bytes on every runtime and under every ambient locale. The coarsest exact token in the pattern decides where the time part is split, so `'m:ss'` on ninety minutes reads `90:00` while `'H:mm:ss'` on the same value reads `1:30:00` — without that a pattern would print whatever the fields were stored as and `PT90S` would come out as `0:00:90`. Calendar fields are used as stored, nothing being able to rebalance them without a reference point, and a negative duration is prefixed once with `-`.
- Added `Duration.prototype.toLocaleString` and `Duration.prototype.toRelative`, which use `Intl.DurationFormat` and `Intl.RelativeTimeFormat` where the runtime provides them and fall back to English where it does not — `Intl.DurationFormat` is recent enough to be absent on LLRT and on Node.js before 23. The fallback follows the same short style, so the shape of the output does not change with the host, only the language. A zero duration renders as a zero count of seconds rather than the empty string `Intl.DurationFormat` returns for it, since a blank label is far likelier to be a bug than an intent; passing `secondsDisplay` yourself still wins.
- `toRelative` shows only the coarsest unit in use, which is what makes the phrasing read naturally — `round` first to pick a different granularity. A duration of milliseconds alone is expressed in seconds, that being the finest unit `Intl.RelativeTimeFormat` has.
- `Duration.prototype.valueOf` throws rather than returning a number. A duration carrying calendar units has no single numeric value, so `d1 > d2` would compare something meaningless; `compare` answers that question and `toString` still works in a template literal.
- Documented `Duration` in `docs/DateTime/Duration.md` and on the website. Every example on both pages was checked against the built package rather than written from memory.

### Fixed

- Fixed the `Duration` Temporal interop tests, which threw on every runtime without Temporal instead of skipping. They guarded with `test.skip`, which `bun test` provides but the cross-runtime harness does not — there a test declared without a body is the skip — so the whole describe body threw and the matrix reported an undiagnosed failure on Node.js 20, 22 and 24, Bun and LLRT. They are now declared inside an `if (DateTime.hasTemporal)` guard, matching the backend-equivalence block in `datetime.spec.ts`, which is the one form both runners understand.

### Changed

- Diagnosed the two remaining runtime shortfalls the matrix was reporting as unexplained. `streamToIter` joins `fromIterAsync` under the existing `IteratorClose` deviation — a runtime that does not close an async generator when a `for await...of` loop exits early never runs the `finally`, so a `break` neither cancels the stream nor releases the reader lock. The match is scoped to the tests that actually depend on that, rather than the whole suite, so unrelated breakage there is still reported as new.
- Added a behavioural probe for `Intl.DateTimeFormat` month and weekday names, and an entry attributing `DateTime`'s name-token failures to it. Presence of the constructor proves nothing here: a runtime built without the name tables still exposes `Intl.DateTimeFormat`, silently ignores the `month` and `weekday` options and returns a numeric date, so only calling it settles the question. Only the `MMM`, `MMMM`, `EEE` and `EEEE` tokens are affected; supplying the names ourselves would mean bundling the locale data the module exists to avoid.
- Moved the unit tables shared by `DateTime` and `Duration` into an internal `datetime/units` module rather than duplicating them, and hardened `DateTime.subtract` to negate the known unit list instead of whatever own keys its argument happens to carry. `Duration` keeps its fields as own enumerable properties precisely so it satisfies `DurationLike` structurally and `DateTime` needs no import of it — the two would otherwise form a cycle — but the negation should not depend on that continuing to hold.
- Added `streamToIter` and `iterToStream`, the bridge between the Streams and Iter modules. The library already had a complete set of async-iterable operators and a Streams module, but no adapter between them, so `mapIterAsync` and the rest could not be pointed at a `ReadableStream`. `streamToIter` closes that gap in the one direction and `iterToStream` in the other, which also makes an `*Iter` pipeline usable as a `Response` body. Both are built on the `ReadableStream` constructor and reader alone, avoiding `TransformStream` for the same reason the rest of the module does — it is absent on some runtimes and would throw at import time.
- `streamToIter` cancels the stream when iteration ends early, matching the platform's own async iteration of a `ReadableStream`, and takes `preventCancel` to leave it open for the next consumer instead; the reader lock is released either way. A stream that errors is not cancelled on the way out, since cancelling an errored stream only re-raises the error it already carries. `ReadableStream` is not async iterable on every runtime — Safari still ships it without `Symbol.asyncIterator` — so this is what gives the operators a handle that works everywhere.
- `iterToStream` pulls its source lazily, one value per read, so backpressure reaches the source unchanged and an infinite generator is safe. Cancelling the stream calls `return` on the source, running a generator's `finally` block. The source is validated at the call rather than on the first read, so a bad argument throws while the stack that produced it is still there.
- Added `wordWrap`, which wraps text to a column width, breaking at whitespace. The package already had `stringWidth`, `stripANSI`, `truncate` and `pad` — the whole terminal-text toolkit except wrapping. Width is measured with `stringWidth` rather than `String.length`, so ANSI escapes cost nothing, CJK and emoji count as two columns, and the result lines up in a terminal where a length-based wrap would not. Each input line is wrapped on its own so paragraph structure survives, leading whitespace is kept so an indented block stays indented, the whitespace run at a break is consumed by the newline, and line endings are normalised to `\n`.
- A word wider than the target overruns by default, keeping a URL or a hash in one piece. `hard` breaks it instead, but only after giving it a line of its own to fit on, so a break is a last resort rather than the first thing tried. Breaking splits on graphemes, never inside one, and keeps an ANSI escape sequence whole; a character wider than the whole column budget overruns by exactly one rather than stalling.

### Changed

- `stringWidth` now answers strings of printable ASCII from their length instead of segmenting them. Every character from space to tilde is a single grapheme of a single column, so the two agree by construction, and the result was checked against the previous implementation across 5,116 strings. Segmentation dominated the cost and a caller measuring many small strings — `wordWrap` going word by word — was building a segmenter for each one. It also means the common case needs no `Intl.Segmenter` at all, so ASCII text now measures and wraps on runtimes built without full ICU, where it previously threw.

## [0.15.1] - 2026-07-29

### Fixed

- Fixed tree shaking, which the build had been defeating entirely. tsup emitted the ESM output as one merged file, so importing a single function pulled in unrelated module-level tables — the CSS named-colour map, the diacritics map and their computed `new RegExp(...)` initialisers, which no bundler can prove pure. The floor was about 3.9 KB per import regardless of what was imported: `noop`, which is `() => {}`, cost 3,963 bytes. `sideEffects: false` could not help, because it lets a bundler drop whole modules that were never imported and merging had left none to drop.

### Changed

- Updated the website `@opentf/std` dependency to 0.15.0, pinned as a registry tarball URL so it always resolves to the published package, and the version shown in the docs header to `v0.15.0`. The dependency serves the playground alone; the docs pages import nothing from the library, so the pinned version does not affect what they describe.
- Corrected the DateTime page's stated import size from 4.5 KB to a measured 4.6 KB min+gzip. On every released version the real cost was 6.3 KB, since the merged bundle put unrelated module-level tables in the way of any single import.
- Formatted `__tests__/datetime/datetime.spec.ts` to match biome. It was the only file in the repository `biome check .` still rejected; the package `lint` script covers `./src` alone, so the drift went unnoticed. Line breaks only — no test behaviour changed.
- Replaced tsup with rolldown as the build tool. The ESM output now preserves one file per module, so unimported code stays in files a bundler can drop. Measured with esbuild against a real install: `noop` 3,963 → 30 bytes, `isString` 3,989 → 56, `sum` 4,016 → 78, `camelCase` 4,217 → 269, `clone` 6,246 → 2,304, `DateTime` 16,661 → 12,771. A consumer importing the entire library pays about 4 KB gzipped more than before (32.4 KB against 28.3 KB) for the per-module boilerplate, which is the intended trade — the whole surface is 266 functions and nobody imports all of them. The CJS output stays a single bundle, since `require` consumers do not tree shake. The published tarball is unchanged in size (1.6 MB unpacked); only the file count rises. Public entry points, the exports map and the runtime matrix results are unaffected.

### Added

- Added a DateTime module — `DateTime`, an immutable date and time in an IANA time zone, covering parsing, field access, DST-safe arithmetic, truncation, comparison and formatting. Time-zone support comes from `Intl.DateTimeFormat` alone, so there is no bundled time-zone database and no dependency. Months and days are 1-based and `dayOfWeek` runs 1 (Monday) to 7 (Sunday), following Temporal and ISO-8601 rather than the legacy `Date`. Calendar units move the wall clock, so adding a day across a DST boundary keeps the local time and may advance 23 or 25 real hours, while exact units move the instant; month arithmetic clamps, so 31 January plus one month is 28 or 29 February. Parsing is strict ISO-8601 and throws rather than yielding an `Invalid Date`, because `Date.parse` is implementation-defined outside the ISO subset and disagrees across runtimes.
- `DateTime` uses the TC39 Temporal API where the runtime provides it and `Intl` everywhere else, behind a single internal interface. Temporal has landed in browsers — Chrome and Edge 144+, Firefox 139+ — and ships on Node.js 26+, Deno and ES-Runtime, but it is still absent on Node.js 22 and earlier (including 20 LTS), Bun, LLRT and Safari, and Node.js 24/25 need `--harmony-temporal`. A Temporal-only implementation would therefore not have run on the supported Node.js LTS line, on Bun, or on the runtime this package is developed and tested on. `fromTemporal` also accepts the older proposal revision shipped by Node.js 24/25, which exposes a `timeZone` object instead of `timeZoneId` — reading only the latter would have silently dropped the zone and fallen back to UTC. The two backends are held to identical behaviour by a differential test that exercises both across a table of zones, DST transitions, instants and durations wherever Temporal exists.
- Added `keyBy`, the one-to-one counterpart of `groupBy`, for indexing a list into a lookup table.
- Added `slidingWindows`, which slides an overlapping fixed-size window over an array — the overlapping counterpart of `chunk`, for moving averages, deltas between neighbours and n-grams.
- Added `runningReduce`, which reduces an array while keeping every intermediate result, for running balances and cumulative totals.
- Added `invert`, which swaps an object's keys and values to build a reverse lookup.
- Added `stripDiacritics`, which removes accents from Latin text for search normalisation and ASCII-only fields. Marks are stripped only where they sit on a Latin letter, so Cyrillic and Greek pass through untouched — `й` decomposes to `и` plus a breve, but the two are separate letters, and collapsing them would misspell the word.
- Added `abortable`, which stops waiting on a promise once an `AbortSignal` fires. It settles the returned promise only — the underlying work is not cancelled, since a promise has no cancel — and swallows a late rejection from the original rather than letting it surface unhandled.
- Added a Cache module — `LruCache` and `TtlCache`. Both are `Map`-shaped. `LruCache` tracks recency through insertion order, so every operation is O(1) without a linked list, and offers `peek` for reads that must not disturb the eviction order. `TtlCache` expires lazily rather than scheduling a timer per entry, which would hold the event loop open.
- Added a Streams module — `streamToText`, `streamToBytes`, `streamToArray`, `streamToLines`, `concatStreams` and `mergeStreams`. Built on `ReadableStream` and `TextDecoder` only, avoiding `TransformStream`, which is absent on some runtimes and would have thrown at import time.
- Added a Semver module — `semverParse`, `semverFormat`, `semverIsValid`, `semverCompare`, `semverSort`, `semverIncrement` and `semverSatisfies`. `semverSatisfies` implements the full npm range grammar (comparators, `^`, `~`, wildcards, hyphen ranges, whitespace-joined sets and `||`), including the rule that withholds pre-releases from ranges that did not ask for one, with an `includePrerelease` opt-out.
- Added `encodeBase32` and `decodeBase32` (RFC 4648). The decoder accepts unpadded, lowercase and whitespaced input, so TOTP/2FA secrets can be passed in the form users are shown them.
- Added `encodeBase58` and `decodeBase58` (Bitcoin alphabet), for identifiers that must survive being read, typed or double-click selected by a human — Bitcoin and Solana addresses, IPFS CIDv0 hashes and short public IDs.
- Added `timingSafeEqual`, a constant-time comparison for secrets. Verifying an `hmacSHA256`/`hmacSHA512` digest with `===` returns on the first differing byte, and that timing difference lets an attacker recover the expected digest one byte at a time.
- Added a cross-runtime test harness that bundles the full suite into a single ES2022 module with no `node:` builtins, so every spec can be executed on any runtime.
- Added a runtime compatibility matrix that runs the suite on Node.js 20/22/24/26, Bun, Deno, ES-Runtime and LLRT, and refreshes the published results when they drift.

### Documentation

- Noted an ES-Runtime deviation found while testing `sleep`: `clearTimeout` cancels the callback but does not release the event-loop reference, so a process lingers until the original delay elapses. It affects process exit time only, never behaviour, and no utility relies on it.
- Documented a new runtime deviation: ES-Runtime and LLRT ignore `TextDecoder`'s `stream: true` option, so a multi-byte character split across two chunks decodes as replacement characters. Affects `streamToText` and `streamToLines` on those runtimes only.
- Added links to local repository docs in README files for offline reference.
- Replaced the unevidenced runtime-agnosticism claim on the Environment Support page with measured per-runtime results, naming the cause of every failure and the utilities it affects.

### Changed

- `sleep` now accepts an optional `AbortSignal`: `sleep(ms, { signal })`. Aborting rejects with `signal.reason` and clears the pending timer, and an already-aborted signal rejects without starting one. The one-argument form is unchanged.
- Consolidated the cross-runtime tooling under `packages/std/__tests__/_matrix/`, instead of splitting it between the repository root and `packages/std/scripts/`.
- Made the test suite runtime-agnostic. Four specs imported `bun:test` or `node:buffer` while the other 142 relied on injected globals; all 146 now resolve the same way, so the suite can run on any runtime providing the standard globals.
- Updated website `@opentf/std` dependency to `0.14.1`, pinned as a registry tarball URL so it always resolves to the published package.
- Updated OTF Web framework dependencies (`@opentf/web` to `^0.24.0`, `@opentf/web-docs` to `^0.21.0`, `@opentf/web-cli` to `^1.22.0`).
- Removed unused `repl.css` stylesheet reference from website `index.html`.

### Fixed

- Fixed `slugify` dropping letters that Unicode cannot decompose. It normalised with `NFD` and then removed anything outside `a–z0–9`, but `ø`, `ß`, `œ`, `ł`, `đ`, `æ` and `þ` are atomic characters with no decomposition, so they were deleted rather than transliterated: `Straße` slugged to `strae`, `Ølberg` to `lberg` and `Þór` to `or`. Any Nordic, Polish, German or Croatian name lost letters. It now returns `strasse`, `olberg` and `thor`. **Slugs generated before this change will not match ones generated after it**, so stored slugs need regenerating.
- Fixed the Cloudflare website build failing with `Cannot find module '@opentf/std'`. A plain `0.14.1` range matched the workspace version, so bun linked `packages/std` instead of the registry package, and its gitignored `dist/` is absent in CI.
- Fixed flaky `shuffle` test by mocking `Math.random` with `spyOn` for deterministic testing.
- Fixed the runtime matrix workflow failing to locate the test bundle. The artifact was uploaded with two paths, so its root became their common ancestor and it extracted to the wrong directory.
- Fixed `rateLimitRun` scheduling a timer for every queued call instead of one per drain. `processQueue` runs on each call and cleared `timeoutId` at the top without clearing the timer it referred to, so the pending timer was orphaned and the next queued call scheduled another. A burst of 5,000 queued calls held 4,990 live timers instead of 1. Rate limiting, ordering and timing are unchanged.





## [0.14.1] - 2026-07-24

### Documentation

- Updated README to align with the website documentation intro page structure and updated header links (`Website | Playground`).



### Added

- Added repo guidelines and agent instructions (`AGENTS.md`).
- Updated release workflow and release configuration.
- Redesigned website footer and badge styling.

### Changed

- Updated documentation website URL to `https://js-std.opentechf.org` and configured Cloudflare Workers deployment (`wrangler.jsonc`).
- Updated website dependency `@opentf/std` to `^0.14.0`.
- Removed unused `clsx` and `tailwind-merge` dependencies from website package.







### Breaking Changes

- Removed public runtime detection helpers: `isNode`, `isBrowser`, `isDeno`, `isBun`, and `isCloudflareWorker`.
- Removed the Runtime documentation category and runtime-specific test matrix.
- Removed `isInteger`; use the standard `Number.isInteger` built-in instead.
- Removed the `coerce` option from `isNumber`; use `toNum` when parsing numeric strings.
- Renamed encoding helpers to verb-first binary codecs: `encodeBase64`, `decodeBase64`, `encodeBase64Url`, `decodeBase64Url`, `encodeHex`, and `decodeHex`.
- Base64 and hex decoders now return `Uint8Array`; use `bytesToString` for UTF-8 text decoding.
- Dropped the `node:crypto` fallback from crypto helpers; they now use the standard Web Crypto API (`globalThis.crypto`) exclusively and throw a clear error when it is unavailable.
- Raised the minimum supported Node.js version to `>=20.0.0`, where Web Crypto is available and stable (Node 18 has reached end-of-life).

### Changed

- `isBoolean` and `isDefined` now expose TypeScript predicate return types for better narrowing.
- `isJSON` now accepts `unknown` input and explicitly returns `false` for non-string values.
- `isPromise` now only matches actual Promise objects instead of arbitrary thenables.
- `pipe` and `compose` now expose typed overloads for common function chains.
- Simplified project validation to build, lint, typecheck, and the Bun test suite.
- Removed Cloudflare Worker/Vitest-pool test configuration from the package.
- Removed the remaining Vitest dependency; tests now run on Bun's native test runner only.

### Fixed

- `clone` now preserves deep `Error.cause` graphs and custom own properties for supported `Error` values.
- Crypto generators now reject invalid non-integer sizes and lengths, and `randomString()` now defaults to length `10`.
- `zip` and `unzip` now expose `undefined` padding in their TypeScript return types, and number formatters now validate option ranges with stable errors.
- `mergeAll` now preserves symbol-keyed values across recursive merges.
- `isEql` now compares supported `Map` object keys structurally and includes symbol-keyed properties for `Error` and shallow object comparisons.
- `pick`, `pickBy`, `omitBy`, `mapKeys`, and `mapValues` now preserve `Object.create(null)` prototypes.
- `fromIterAsync` now forwards `return()` and `throw()` so wrapped iterators close correctly on early exit and propagated errors.
- Flow helpers now validate invalid numeric options consistently, and `batchRun` now rejects when the batch processor returns the wrong number of results.
- Maths reducers now ignore sparse array holes consistently across `mean`, `median`, `mode`, `variance`, and `stddev`.
- `round`, `stringInsertAt`, and `stringReplaceAt` now reject invalid fractional or negative precision/index inputs with stable errors.
- `truncate`, `pad`, and `repeat` now validate invalid fractional, negative, and non-finite length/count inputs consistently.
- `decodeBase64Url` now rejects non-URL-safe `+` and `/` characters instead of accepting the standard Base64 alphabet.
- `stringReplace` now treats string patterns literally, preserves existing `RegExp` flags, and aligns its TypeScript signature with documented replacement-function support.
- `dropWhile(..., true)` now preserves the original callback indexes and source array instead of evaluating against a reversed view.
- `takeWhile(..., true)` now preserves the original callback indexes and source array instead of evaluating against a reversed view.
- `formatBytes` now keeps fractional values smaller than `1` byte in the `B` unit instead of producing an undefined unit label.
- `formatCompact` and `formatCurrency` now reject invalid `display` option values instead of silently falling back to defaults.
- `fromPath` now preserves leading array-index segments such as `[0]` instead of dropping the opening bracket.
- `size` and `isEmpty` now count enumerable symbol-keyed properties on plain objects.
- `toNum` now rejects invalid numeric-separator placements such as `0_2`, `1_e2`, and `1._5` while continuing to support valid separated decimal, binary, and hex strings.
- `pickBy`, `omitBy`, `mapKeys`, and `mapValues` now include enumerable symbol keys instead of silently dropping them.
- Async array helpers now skip sparse holes like their native `Array.prototype` counterparts, and `reduceAsync` now starts from the first present element when no initial value is provided.
- `words` now treats string patterns literally instead of interpreting regex metacharacters such as `+` and `.`.
- `unescapeHTML` now decodes the named apostrophe entity `&apos;` in addition to `&#39;`.
- Reworked `memoizeRun` default keying to support structural caching for common built-in value types, including `BigInt`, `Date`, `Map`, `Set`, typed arrays, and cyclic structures, while preserving reference identity for unsupported object instances and functions.
- Preserved `Object.create(null)` prototypes across `merge`, `mergeAll`, `shallowMerge`, and `shallowMergeAll`.
- Corrected the CSS named color mapping for `palegreen` in `color()`.
- Aligned sync crypto helpers (`randomBytes`, `randomInt`, `randomFloat`, `uuidv4`, and `uuidv7`) with strict capability detection so they now fall back to `node:crypto` in Node-compatible environments instead of requiring `globalThis.crypto`.
- Aligned `isJSON` with its public name so it now returns `true` for any valid JSON string instead of only plain-object JSON.
- Prevented `set` and `toSet` from overwriting existing falsy intermediate values such as `0`, `false`, `''`, and `null` when traversing deep paths.
- Hardened object path mutators against unsafe prototype keys in `set`, `unset`, `toSet`, and `toUnset`.
- Preserved `Object.create(null)` prototypes and `RegExp.lastIndex` during cloning, and clarified that unsupported object instances are preserved by reference.
- Added validation for invalid async concurrency and rate-limit options.
- Corrected `isAsyncFunction` and `isGeneratorFunction` so async generator functions no longer match either guard.
- Removed an internal TypeScript suppression from `withResolvers`.

## 1.0.0-beta.3

### Minor Changes

- df5ea5d: Crypto
  - Added sha256(input) — SHA-256 hash, cross-runtime (Node/Bun sync, browser/Deno async)
  - Added sha512(input) — SHA-512 hash, cross-runtime
  - Added hmacSHA256(key, message) — HMAC-SHA-256 digest
  - Added hmacSHA512(key, message) — HMAC-SHA-512 digest
  - Added randomFloat(min, max) — cryptographically strong random float
    Array
  - Added flatMap(arr, fn), zip(...arrays), unzip(arr), sample(arr)
  - Added takeWhile(arr, fn), dropWhile(arr, fn), chunkWhile(arr, fn), partition(arr, fn)
  - Added flatten(arr, depth) with depth support
  - Renamed uniq → unique (merged uniqueBy via optional by callback)
  - Renamed arrayInsert/arrayRemove/arrayReplace → insert/remove/replace
    Iter (Sync & Async)
  - Added full sync iterator equivalents: mapIter, filterIter, flatMapIter, reduceIter, toArrayIter, eachIter, someIter, everyIter, findIter, findLastIter, findIndexIter, findLastIndexIter, firstIter, lastIter, nthIter, countIter, takeWhileIter, dropWhileIter
  - Added eachIterAsync, someIterAsync, everyIterAsync, findIterAsync, findLastIterAsync, findIndexIterAsync, findLastIndexIterAsync, firstIterAsync, lastIterAsync, nthIterAsync, countIterAsync, takeWhileIterAsync, dropWhileIterAsync, fromIterAsync, toAsyncIter
  - Renamed forEachIterAsync → eachIterAsync
  - Added isIterable and isAsyncIterable type guards
    Runtime Detection
  - Added isNode(), isBrowser(), isDeno(), isBun() — cross-runtime detection
    Object
  - Fixed prototype pollution guard formatting in get, set, has, merge, clone, etc.
    Concurrency
  - Added eachAsync(arr, fn) (renamed from forEachAsync)

## 1.0.0-beta.2

### Minor Changes

- 37a1df8: 🛡️ Security Fixes Implemented:

  Performed a security audit of all object-manipulation utilities and implemented strict key filtering to block access to sensitive keys (**proto**, constructor, prototype). The following utilities are now secured:

  set.ts: Prevented path-based pollution of the global prototype.
  unset.ts: Blocked the ability to delete properties from the global prototype (preventing DoS attacks).
  merge.ts & mergeAll.ts: Added guards to prevent deep-merging from traversing into internal object properties.
  clone.ts: Ensured that cloning an object cannot inadvertently modify the prototype of the new instance.
  mapKeys.ts: Protected against transformation mappers that return sensitive key names.

## 1.0.0-beta.1

### Patch Changes

- fae9b36: Fixed build to have readme and license copied for publishing.

## 1.0.0-beta.0

### Major Changes

- 46ad161: ### v1.0.0-beta.0 Release Audit & Stabilization

  - **Project Modernization**: Migrated the entire codebase to **Bun**, **Vitest**, and **Biome**. Overhauled the build system and CI pipeline for high-performance execution and cross-runtime verification.
  - **FlowControl Module**: Introduced a comprehensive suite of execution control utilities:
    - `idleRun` (Debounce with leading/trailing/maxWait)
    - `paceRun` (Throttle with leading/trailing)
    - `batchRun` (Argument grouping and delayed execution)
    - `memoizeRun` (Async caching with Single Flight and TTL)
    - `retryRun` (Exponential backoff and retry logic)
    - `timeoutRun` (Enforce execution time limits)
    - `rateLimitRun` (Rolling window rate limiting)
  - **Unified Color Utility**: Replaced fragmented color functions with a powerful, unified `color` utility supporting **Hex**, **RGB**, **HSL**, and **OKLCH**. Added advanced features like `colorMix`, `colorContrast`, `colorInvert`, and **ANSI TrueColor** support.
  - **Crypto & Encoding**: Added industrial-strength utilities for `uuidv4`, `uuidv7`, `randomId`, `base64`, and `hex` encoding/decoding.
  - **Math Utilities**:
    - Refactored `sum`, `prod`, `mean`, `median`, and `mode` to be generic `<T>`, supporting object arrays with custom callbacks.
    - Corrected `prod([])` to return `1` (mathematical empty product).
    - Fixed `mode` to return `[]` for unique element sets.
  - **Array Utilities**:
    - `min`, `max`, and `bounds` now support string arrays (lexicographical comparison).
    - Overhauled `range` and `sortBy` for better performance and compliance with ECMAScript proposals.
  - **String Utilities**:
    - Rewrote `stringWidth` to use `Intl.Segmenter` for accurate character counting.
    - Improved `stripANSI` regex for broader terminal sequence coverage.
  - **Object Utilities**:
    - Standardized performance for `merge`, `clone`, `omit`, and `pick`.
    - Added strict input clamping and enhanced error handling across all path-based utilities.
  - **Documentation & DX**:
    - Launched a premium Nextra-based documentation site with interactive REPL demos for every utility.
    - Audited and refactored all 148+ utilities for consistency.
    - Added project branding and version badges.

## 0.13.0

### Minor Changes

- 8d0ddfd: Added aResolvers aync utils.

## 0.12.0

### Minor Changes

- 66bdf45: Fixed isObj to support class.

## 0.11.0

### Minor Changes

- 0d1451e: Added mutable set & unset variant functions.

## 0.10.0

### Minor Changes

- 7a05b94: Added array shuffle & swap functions.

## 0.9.0

### Minor Changes

- 928a959: Added Set Composition methods like isSubsetOf, isSupersetOf & isDisjointFrom and Fixed size function to return -1 instead of null for unsupported types.

## 0.8.1

### Patch Changes

- f12c647: Updated readme with articles section.

## 0.8.0

### Minor Changes

- 1de5642: Fixed arrReplace by adding deleteCount param.

## 0.7.0

### Minor Changes

- 7b26d14: Added rgbToHex color function.

## 0.6.2

### Patch Changes

- 27f58d2: Updated pkg repo field.

## 0.6.1

### Patch Changes

- 2306bde: Updated readme with jsr badge.

## 0.6.0

### Minor Changes

- 3d6e4d9: Added functions composition related functions, Math avg & Array reverse fns.

## 0.5.1

### Patch Changes

- 93dd23b: Updated readme.

## 0.5.0

### Minor Changes

- 9b23586: Fixed async fns not awaiting within cb fn.

## 0.4.0

### Minor Changes

- 15b0271: Added array intersperse fn.

## 0.3.0

### Minor Changes

- 7bbe29a: Added buffers, errors, regex support for clone fn.

## 0.2.0

### Minor Changes

- d92933d: Fixed isEql assertion.

## 0.1.1

### Patch Changes

- b9e7b07: Updated readme.

## 0.1.0

### Minor Changes

- b0bbd90: Release initial version for @opentf/std

## 0.42.0

### Minor Changes

- 3106d1c: Fixed range fn based on the iterator range proposal.

## 0.41.0

### Minor Changes

- b6d79ca: Fixed cloning sparsed arrays.

## 0.40.0

### Minor Changes

- 39f3fc1: Added object omit & pick util fns.

## 0.39.0

### Minor Changes

- 1c8ea8b: Added object get, set, has, unset, fromPath & toPath utils.

## 0.38.0

### Minor Changes

- 133b4d0: Added symDiff, union, uniq & renamed some array utils.

## 0.37.0

### Minor Changes

- 9472d6c: Added async map & forEach fns.

## 0.36.0

### Minor Changes

- fec646b: Changed move fn to return new array.

## 0.35.0

### Minor Changes

- 4354b39: Added arrIns, arrReplace, arrRm & countBy array util fns.

## 0.34.0

### Minor Changes

- 08dc207: Added chunk, compact, intersection, isEqlArr util fns.

## 0.33.0

### Minor Changes

- 49fc010: Added isEql common util fn.

## 0.32.0

### Minor Changes

- bdbf93b: Added strReplace fn.

## 0.31.0

### Minor Changes

- 2ea7424: Added merge utils fns & renamed arrayDiff to diff

## 0.30.0

### Minor Changes

- 9f6026e: Fixed sorting issues.

## 0.29.0

### Minor Changes

- ff6d1f3: Added array, maths, types, object category utility fns.

## 0.28.0

### Minor Changes

- 3c9b6cf: Added type assertion utility fns.

## 0.27.0

### Minor Changes

- 5a4ff85: Added isShallowEql fn for comparing two values by shallow comparison.

## 0.26.0

### Minor Changes

- 8bafd6f: Added isJSON types utility fn.

## 0.25.0

### Minor Changes

- 2942e8b: Fixed groupBy types.

## 0.24.1

### Patch Changes

- a0937e1: Updated readme.

## 0.24.0

### Minor Changes

- cb6520c: Added array move utility fn.

## 0.23.0

### Minor Changes

- 29b2671: Added unset util fn & removed inferType util.

## 0.22.1

### Patch Changes

- aab4313: Updated readme.

## 0.22.0

### Minor Changes

- c7379da: Added pkg provenance support

## 0.21.0

### Minor Changes

- d6be858: Added array groupBy util function.
- 39b6947: Removed unwanted flooring of values in percentage calc.

## 0.20.0

### Minor Changes

- c1d68f9: Added hexToRGB color values converting util.

## 0.19.0

### Minor Changes

- 2630912: Added array async filter fn

## 0.18.0

### Minor Changes

- 34140c6: Fixed insertAt to allow empty string to be inserted.

## 0.17.0

### Minor Changes

- 648dc19: Fixed `replaceAt` to accept empty string to be replaced.

## 0.16.3

### Patch Changes

- 5076976: Added playground link to readme

## 0.16.2

### Patch Changes

- 91ea57c: Added missing usage section to readme

## 0.16.1

### Patch Changes

- 83a8f64: Added usage section to readme

## 0.16.0

### Minor Changes

- df9233d: Added range utility function.

## 0.15.0

### Minor Changes

- 3a4ab6c: Migrate from parcel, yarn workspaces to turborepo, tsup, etc.
