/**
 * Pins the public type surface.
 *
 * Every type a caller needs in order to write down what they pass to, or get
 * back from, an exported function must be reachable from the package entry.
 * A type that is only *declared* — not exported — leaves callers unable to
 * name it, so a wrapper has to inline the shape and drifts from ours.
 *
 * There is nothing to run here: the assertions are the compile. This file is
 * checked by `tsconfig.api.json`, not by `bun test`, and deliberately sits
 * outside the main `tsconfig.json` because the rest of `__tests__` feeds
 * wrong types to functions on purpose to exercise their runtime guards.
 */

import type {
  AccessibilityLevel,
  BatchRunOptions,
  ColorFormat,
  ColorFormatMap,
  ColorInput,
  ColorOutput,
  DeepReadonly,
  EncodeBase32Options,
  EncodeBase64UrlOptions,
  HSLA,
  IdleRunFn,
  IdleRunOptions,
  IsEqlOptions,
  MemoizeRunFn,
  MemoizeRunOptions,
  OKLCH,
  OrderTuples,
  OrderType,
  PaceRunFn,
  PaceRunOptions,
  Primitive,
  PromiseResolvers,
  PropertyPath,
  RGBA,
  RetryRunOptions,
  Semver,
  SemverRelease,
  SemverSatisfiesOptions,
  SleepOptions,
  SortCB,
  StreamToIterOptions,
  StringReplaceOptions,
  StringReplacer,
  TimeoutRunOptions,
  TypedArray,
  WordWrapOptions,
} from '../../src';
import {
  batchRun,
  color,
  colorGrayscale,
  colorInvert,
  colorIsReadable,
  colorLighten,
  colorMix,
  deepFreeze,
  encodeBase32,
  encodeBase64Url,
  flatten,
  flattenObject,
  get,
  has,
  idleRun,
  isArrayLike,
  isEql,
  isPrimitive,
  memoizeRun,
  paceRun,
  retryRun,
  semverIncrement,
  semverParse,
  semverSatisfies,
  set,
  sleep,
  sort,
  sortBy,
  streamToIter,
  stringReplace,
  timeoutRun,
  toPath,
  unflattenObject,
  withResolvers,
  wordWrap,
} from '../../src';

/** Fails to compile unless `Actual` is assignable to `Expected`. */
function accepts<Expected>(_value: Expected): void {}

/**
 * True only when `X` and `Y` are the same type. Assignability is too weak
 * here: everything is assignable to `any`, which is what several of these
 * signatures used to return.
 */
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

/** Fails to compile unless the argument type resolves to `true`. */
function assertType<_T extends true>(): void {}

// --- Array -----------------------------------------------------------------

const order: OrderType = 'desc';
accepts<OrderType>('asc');
sort([3, 1, 2], order);

type Row = { id: number; name: string };
const byName: SortCB<Row> = (row) => row.name;
const criteria: OrderTuples<Row> = [
  ['id', 'asc'],
  [byName, 'desc'],
];
sortBy<Row>([{ id: 1, name: 'a' }], ...criteria);

// The depth decides the element type, as with `Array.prototype.flat`, so a
// partial flatten still reports what it left nested. This returned `any[]`
// at every depth before.
const flatOnce = flatten([1, [2, [3]]]);
assertType<Equals<typeof flatOnce, (number | number[])[]>>();

const flatTwice = flatten([1, [2, [3]]], 2);
assertType<Equals<typeof flatTwice, number[]>>();

// An unbounded depth cannot resolve to one element type, exactly as
// `Array.prototype.flat(Infinity)` cannot.
accepts<unknown[]>(flatten([1, [2, [3]]], Number.POSITIVE_INFINITY));

// --- String ----------------------------------------------------------------

const replaceOptions: StringReplaceOptions = { all: true, case: false };
stringReplace('a-b', '-', '+', replaceOptions);

const replacer: StringReplacer = (substring) => substring.toUpperCase();
stringReplace('a-b', /[a-z]/, replacer, { all: true });

const wrapOptions: WordWrapOptions = { hard: true };
wordWrap('some text', 10, wrapOptions);

// --- Assert ----------------------------------------------------------------

const eqlOptions: IsEqlOptions = { shallow: true };
isEql({ a: 1 }, { a: 1 }, eqlOptions);

// --- Timing ----------------------------------------------------------------

const sleepOptions: SleepOptions = { signal: new AbortController().signal };
sleep(1, sleepOptions);

// --- Concurrency -----------------------------------------------------------

const resolvers: PromiseResolvers<number> = withResolvers<number>();
accepts<Promise<number>>(resolvers.promise);
resolvers.resolve(1);
resolvers.reject(new Error('nope'));

// --- Flow ------------------------------------------------------------------

const idleOptions: IdleRunOptions = {
  leading: true,
  trailing: false,
  maxWait: 5,
};
const debounced: IdleRunFn<(val: string) => void> = idleRun(
  (_val: string) => {},
  1,
  idleOptions,
);
debounced('a');
accepts<boolean>(debounced.pending());
debounced.flush();
debounced.cancel();

const paceOptions: PaceRunOptions = { leading: false, trailing: true };
const throttled: PaceRunFn<(val: string) => void> = paceRun(
  (_val: string) => {},
  1,
  paceOptions,
);
throttled('a');
accepts<boolean>(throttled.pending());

const batchOptions: BatchRunOptions = { limit: 10, delay: 50 };
batchRun<[number], number>(async (list) => list.map(([n]) => n), batchOptions);

const retryOptions: RetryRunOptions = {
  retries: 2,
  delay: 10,
  backoff: 'exponential',
  onRetry: (_error, _attempt) => {},
};
retryRun(async () => 1, retryOptions);

// The fallback is tied to the function's own result type, so a mismatch is
// caught here rather than at the timeout.
const timeoutOptions: TimeoutRunOptions<number> = {
  message: 'too slow',
  fallback: 0,
};
timeoutRun(async () => 1, 10, timeoutOptions);

const memoOptions: MemoizeRunOptions<[number]> = {
  maxAge: 100,
  key: (n) => String(n),
};
const memoized: MemoizeRunFn<string, [number]> = memoizeRun(
  async (n: number) => String(n),
  memoOptions,
);
accepts<Promise<string>>(memoized(1));
memoized.clear();

// --- Object ----------------------------------------------------------------

// One name for the string form and the segment form, used by every accessor.
const stringPath: PropertyPath = 'a.b[0].c';
const segmentPath: PropertyPath = ['a', 'b', 0, 'c'];
accepts<unknown[]>(toPath(stringPath));
accepts<unknown[]>(toPath(segmentPath));
accepts<unknown[]>(toPath(Symbol('k')));
accepts<unknown[]>(toPath(0));
get({ a: 1 }, stringPath);
has({ a: 1 }, segmentPath);
set({ a: 1 }, stringPath, 2);
// A function at `value` is an updater, and is as valid as any other value.
set({ a: 1 }, stringPath, (n: unknown) => n);

// --- Types -----------------------------------------------------------------

const bytes: TypedArray = new Uint8Array([1, 2, 3]);
accepts<number>(bytes.length);

// --- Colors ----------------------------------------------------------------

accepts<ColorInput>('rebeccapurple');
accepts<ColorInput>(0xff0000);
accepts<ColorInput>([255, 0, 0]);
accepts<ColorInput>({ r: 255, g: 0, b: 0, a: 1 });
accepts<ColorInput>({ h: 0, s: 1, l: 0.5 });
accepts<ColorInput>({ l: 0.5, c: 0.2, h: 30 });

// The format decides the result, so each is pinned exactly rather than merely
// checked for assignability — `any` satisfied every such check before.
const hex = color('red', 'hex');
assertType<Equals<typeof hex, string>>();

const packed = color('red', 'number');
assertType<Equals<typeof packed, number>>();

const rgbaObj = color('red', 'rgba-object');
assertType<Equals<typeof rgbaObj, RGBA>>();

const hslaObj = color('red', 'hsla-object');
assertType<Equals<typeof hslaObj, HSLA>>();

const oklchObj = color('red', 'oklch-object');
assertType<Equals<typeof oklchObj, OKLCH>>();

const rgbaArr = color('red', 'rgba-array');
assertType<Equals<typeof rgbaArr, [number, number, number, number]>>();

// A format known only to be a `ColorFormat` yields every possibility.
declare const runtimeFormat: ColorFormat;
accepts<ColorOutput>(color('red', runtimeFormat));

// The derivatives forward the format, and default to 'hex' when it is omitted.
const lightened = colorLighten('red', 0.1);
assertType<Equals<typeof lightened, string>>();

const mixed = colorMix('red', 'blue', 0.5, 'rgba-object');
assertType<Equals<typeof mixed, RGBA>>();

const inverted = colorInvert('red', 'number');
assertType<Equals<typeof inverted, number>>();

const gray = colorGrayscale('red');
assertType<Equals<typeof gray, string>>();

// The map must stay in step with the format union, or `ColorOutput` silently
// stops covering a format.
accepts<ColorFormat>('' as keyof ColorFormatMap);
accepts<keyof ColorFormatMap>('' as ColorFormat);

const level: AccessibilityLevel = 'AAA_Large';
colorIsReadable('white', 'black', level);

// --- Encoding --------------------------------------------------------------

const base64UrlOptions: EncodeBase64UrlOptions = { pad: false };
encodeBase64Url(new Uint8Array([1]), base64UrlOptions);

const base32Options: EncodeBase32Options = { pad: false };
encodeBase32(new Uint8Array([1]), base32Options);

// --- Semver ----------------------------------------------------------------

const parsed: Semver = semverParse('1.2.3-alpha.1+build.5');
accepts<number>(parsed.major);
accepts<(string | number)[]>(parsed.prerelease);
accepts<string[]>(parsed.build);

const release: SemverRelease = 'preminor';
semverIncrement('1.2.3', release);

const satisfiesOptions: SemverSatisfiesOptions = { includePrerelease: true };
semverSatisfies('1.2.3', '^1.0.0', satisfiesOptions);

// --- Streams ---------------------------------------------------------------

declare const stream: ReadableStream<Uint8Array>;
const streamOptions: StreamToIterOptions = { preventCancel: true };
streamToIter(stream, streamOptions);

// --- Object ----------------------------------------------------------------

const frozen = deepFreeze({ a: { b: 1 }, list: [{ c: 2 }] });
assertType<Equals<typeof frozen.a.b, number>>();
// The readonly modifier must survive both a nested object and an array.
assertType<
  Equals<
    typeof frozen,
    DeepReadonly<{ a: { b: number }; list: { c: number }[] }>
  >
>();
accepts<readonly { readonly c: number }[]>(frozen.list);

// A function reached by the type stays callable rather than being mapped.
declare const withFn: DeepReadonly<{ run: (n: number) => string }>;
accepts<string>(withFn.run(1));

accepts<Record<string, unknown>>(flattenObject({ a: { b: 1 } }));
accepts<Record<string, unknown> | unknown[]>(unflattenObject({ 'a.b': 1 }));

// --- Types -----------------------------------------------------------------

declare const maybe: unknown;

if (isPrimitive(maybe)) {
  accepts<Primitive>(maybe);
}

if (isArrayLike(maybe)) {
  accepts<number>(maybe.length);
}
