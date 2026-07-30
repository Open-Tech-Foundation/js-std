# semverCoerce

Pulls a valid version out of a loosely written one.

Versions in the wild are rarely canonical — a git tag reads `v2`, a Docker
image `node:20.11`, a vendored file `4.17.21.min`. Each means something obvious
to a reader and nothing to `semverParse`, which requires all three components
and throws otherwise. This fills the missing ones with zero so the rest of the
module can be used on them.

The first version-shaped run wins, and anything after the third component is
discarded — including a pre-release or build suffix, which cannot be trusted to
mean what it looks like in a string this loose. Coerce first and parse the
result when you need the parts.

What comes out is still held to the specification, so a component with a
leading zero is not silently renumbered: `'007'` yields `null` rather than
`'7.0.0'`.

@param {string} version The string to coerce.
@returns {string|null} A canonical version string, or `null` if there is no
version-shaped run in the input.

### Example

```js
semverCoerce('v2') //=> '2.0.0'
semverCoerce('20.11') //=> '20.11.0'
semverCoerce('4.17.21.min') //=> '4.17.21'

semverCoerce('release-1.2.3-rc.1') //=> '1.2.3'
semverCoerce('not a version') //=> null
semverCoerce('007') //=> null
```
