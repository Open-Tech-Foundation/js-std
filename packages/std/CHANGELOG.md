# @opentf/std

## [Unreleased]

### Added

- Added `abortable`, which stops waiting on a promise once an `AbortSignal` fires. It settles the returned promise only — the underlying work is not cancelled, since a promise has no cancel — and swallows a late rejection from the original rather than letting it surface unhandled.
- Added a Cache module — `LruCache` and `TtlCache`. Both are `Map`-shaped. `LruCache` tracks recency through insertion order, so every operation is O(1) without a linked list, and offers `peek` for reads that must not disturb the eviction order. `TtlCache` expires lazily rather than scheduling a timer per entry, which would hold the event loop open.
- Added a Streams module — `streamToText`, `streamToBytes`, `streamToArray`, `streamToLines`, `concatStreams` and `mergeStreams`. Built on `ReadableStream` and `TextDecoder` only, avoiding `TransformStream`, which is absent on some runtimes and would have thrown at import time.
- Added a Semver module — `semverParse`, `semverFormat`, `semverIsValid`, `semverCompare`, `semverSort`, `semverIncrement` and `semverSatisfies`. `semverSatisfies` implements the full npm range grammar (comparators, `^`, `~`, wildcards, hyphen ranges, whitespace-joined sets and `||`), including the rule that withholds pre-releases from ranges that did not ask for one, with an `includePrerelease` opt-out.
- Added `encodeBase32` and `decodeBase32` (RFC 4648). The decoder accepts unpadded, lowercase and whitespaced input, so TOTP/2FA secrets can be passed in the form users are shown them.
- Added `encodeBase58` and `decodeBase58` (Bitcoin alphabet), for identifiers that must survive being read, typed or double-click selected by a human — Bitcoin and Solana addresses, IPFS CIDv0 hashes and short public IDs.
- Added `timingSafeEqual`, a constant-time comparison for secrets. Verifying an `hmacSHA256`/`hmacSHA512` digest with `===` returns on the first differing byte, and that timing difference lets an attacker recover the expected digest one byte at a time.
- Added a cross-runtime test harness that bundles the full suite into a single ES2022 module with no `node:` builtins, so every spec can be executed on any runtime.
- Added a runtime compatibility matrix that runs the suite on Node.js 20/22/24, Bun, Deno, ES-Runtime and LLRT, and refreshes the published results when they drift.

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
