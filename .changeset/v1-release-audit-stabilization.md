---
"@opentf/std": major
---

### v1.0.0-beta.1 Release Audit & Stabilization

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
