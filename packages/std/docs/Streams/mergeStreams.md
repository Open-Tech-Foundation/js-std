# mergeStreams

Interleaves streams, forwarding every chunk as soon as any source produces it. The result closes once every source has closed, and errors as soon as any source errors.

Because the sources are read concurrently, chunk order between them is not defined — only the order within a single source is. Use `concatStreams` when order across sources matters.

@param streams - The streams to merge.
@returns A stream over every chunk, as it arrives.

### Example

```js
const events = mergeStreams(clicks, keys);
await streamToArray(events)
```
