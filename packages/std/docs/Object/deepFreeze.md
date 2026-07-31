# deepFreeze

Recursively freezes an object and everything reachable from it.

`Object.freeze` is shallow — it seals the object it is given and leaves every
nested object it holds writable, so a configuration or a fixture frozen with it
is only frozen one level down. This walks the whole graph.

Reached are own properties, array elements, and the keys and values of a `Map`
or `Set`. Both string and symbol keys are followed. Accessor properties are not:
reading one would run it, which a getter is free to treat as an event or to
answer with a fresh object nothing else holds.

Cycles are handled, and a shared object reached twice is frozen once.

A `Map` or `Set` is itself frozen, which stops properties being added to it but
not `set`, `add` or `delete` — its entries live in internal slots that no
JavaScript mechanism can seal. The same is true of `Date`. Their contents are
frozen; the containers cannot be.

Typed arrays and `DataView`s are skipped rather than frozen. `Object.freeze`
throws on a non-empty one, since its elements sit in a buffer that cannot be
made non-configurable, so passing a structure holding binary data neither fails
nor silently protects it.

The object is frozen in place and returned, so the argument and the result are
the same object. Freezing is permanent: there is no thaw.

@param {T} val The value to freeze.
@returns {DeepReadonly<T>} The same value, deeply frozen.

### Example

```js
const config = deepFreeze({ db: { port: 5432 } });
config.db.port = 1; //=> ignored, or TypeError in strict mode

deepFreeze([{ a: 1 }]);
//=> the array and the object inside it are both frozen
```
