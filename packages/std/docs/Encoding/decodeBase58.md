# decodeBase58

The longest Base58 string this will decode.

Base58 has no block structure — every character carries into the whole
accumulator — so decoding is quadratic in the length of the input, and that
is a property of the encoding rather than of this implementation. 16,000
characters take about half a second, 50,000 take five, and the curve keeps
going.

The encoding is used for identifiers, which are short: a Bitcoin address is
about 35 characters, an IPFS CIDv0 is 46, an extended key 111. The limit is
far above all of them and holds the worst case to roughly 90 ms.
