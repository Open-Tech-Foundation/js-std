# encodeBase58

The most bytes this will encode.

Base58 has no block structure — every byte carries into the whole
accumulator — so encoding is quadratic in the length of the input, as
decoding is. 100,000 bytes took 57 seconds.

The encoding is used for identifiers, which are short: a Bitcoin address is
25 bytes before encoding, an IPFS CIDv0 34. The limit is far above those and
holds the worst case to well under a second.
