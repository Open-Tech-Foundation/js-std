---
"@opentf/std": minor
---

Crypto
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
