/**
 * Pins the public type surface.
 *
 * Every type a caller needs in order to write down what they pass to, or get
 * back from, an exported function must be reachable from the package entry.
 * A type that is only *declared* — not exported — leaves callers unable to
 * name it, so a wrapper has to inline the shape and drifts from ours.
 *
 * There is nothing to run here: the assertions are the compile. This file is
 * checked by `tsconfig.api.json`, not by the runtime test suite, and deliberately sits
 * outside the main `tsconfig.json` because the rest of `__tests__` feeds
 * wrong types to functions on purpose to exercise their runtime guards.
 */

import type {
  AccessibilityLevel,
  BatchRunOptions,
  ColorAlphaOptions,
  ColorContrastOptions,
  ColorConvert,
  ColorDarkenOptions,
  ColorDesaturateOptions,
  ColorFormat,
  ColorFormatMap,
  ColorGrayscaleOptions,
  ColorInput,
  ColorInvertOptions,
  ColorIsReadableOptions,
  ColorLightenOptions,
  ColorMixOptions,
  ColorOutput,
  ColorRotateHueOptions,
  ColorSaturateOptions,
  ColorSourceFormat,
  ColorWCAGLevelOptions,
  ConcurrencyOptions,
  DeepReadonly,
  EncodeBase32Options,
  EncodeBase64UrlOptions,
  FormatCurrencyOptions,
  HSLA,
  IdleRunFn,
  IdleRunOptions,
  InRangeOptions,
  InsertAtOptions,
  InsertOptions,
  IsEqualOptions,
  IsSubsetOfOptions,
  IsSupersetOfOptions,
  JsonArray,
  JsonObject,
  JsonValue,
  LimitRunFn,
  MemoizeRunFn,
  MemoizeRunOptions,
  MoveOptions,
  OKLCH,
  OrderTuples,
  OrderType,
  PaceRunFn,
  PaceRunOptions,
  PadOptions,
  PollRunOptions,
  Primitive,
  PromiseResolvers,
  PropertyPath,
  RGBA,
  RateLimitRunOptions,
  ReduceAsyncOptions,
  ReduceIterAsyncOptions,
  RemoveAtOptions,
  ReplaceAtOptions,
  RetryRunOptions,
  Semver,
  SemverIncrementOptions,
  SemverRelease,
  SemverSatisfiesOptions,
  SleepOptions,
  SortCB,
  StreamToIterOptions,
  StringReplaceOptions,
  StringReplacer,
  StringSpliceOptions,
  SwapOptions,
  TimeoutRunOptions,
  TruncateOptions,
  TryParseJSONOptions,
  TryStringifyJSONOptions,
  TtlCacheSetOptions,
  TypedArray,
  WordWrapOptions,
} from '../../src';
import {
  TtlCache,
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
  formatCurrency,
  get,
  has,
  idleRun,
  inRange,
  insert,
  insertAt,
  isArrayLike,
  isEqual,
  isJSONValue,
  isPrimitive,
  isSubsetOf,
  isSupersetOf,
  limitRun,
  mapAsync,
  memoizeRun,
  move,
  paceRun,
  pad,
  pollRun,
  rateLimitRun,
  reduceAsync,
  reduceIterAsync,
  removeAt,
  replaceAt,
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
  stringSplice,
  swap,
  timeoutRun,
  toPath,
  truncate,
  tryParseJSON,
  tryStringifyJSON,
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

const insertOptions: InsertOptions<number> = { items: [5], position: 'after' };
accepts<number[]>(insert([1, 2, 3], 1, insertOptions));

const moveOptions: MoveOptions = { from: 0, to: 2 };
accepts<number[]>(move([1, 2, 3], moveOptions));

const removeAtOptions: RemoveAtOptions = { count: 2 };
accepts<number[]>(removeAt([1, 2, 3, 4], 1, removeAtOptions));

const insertAtOptions: InsertAtOptions<number> = { items: [5] };
const replaceAtOptions: ReplaceAtOptions<number> = { items: [5] };
const swapOptions: SwapOptions = { x: 0, y: 2 };
accepts<number[]>(insertAt([1, 2, 3], 1, insertAtOptions));
accepts<number[]>(replaceAt([1, 2, 3], 1, replaceAtOptions));
accepts<number[]>(swap([1, 2, 3], swapOptions));

const order: OrderType = 'desc';
accepts<OrderType>('asc');
sort([3, 1, 2], order);

type Row = { id: number; name: string };
const byName: SortCB<Row> = (row) => row.name;
const criteria: OrderTuples<Row> = [
  ['id', 'asc'],
  [byName, 'desc'],
];
sortBy<Row>([{ id: 1, name: 'a' }], { criteria });

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

const replaceOptions: StringReplaceOptions = {
  replacement: '+',
  all: true,
  case: false,
};
stringReplace('a-b', '-', replaceOptions);

const replacer: StringReplacer = (substring) => substring.toUpperCase();
stringReplace('a-b', /[a-z]/, { replacement: replacer, all: true });

const wrapOptions: WordWrapOptions = { hard: true };
wordWrap('some text', 10, wrapOptions);

// --- Assert ----------------------------------------------------------------

const eqlOptions: IsEqualOptions = { shallow: true };
isEqual({ a: 1 }, { a: 1 }, eqlOptions);

const concurrencyOptions: ConcurrencyOptions = { concurrency: 2 };
const reduceAsyncOptions: ReduceAsyncOptions<number> = { initialValue: 0 };
const reduceIterAsyncOptions: ReduceIterAsyncOptions<number> = {
  initialValue: 0,
};
void [concurrencyOptions, reduceAsyncOptions, reduceIterAsyncOptions];
accepts<Promise<number[]>>(
  mapAsync([1, 2], async (value) => value * 2, concurrencyOptions),
);
accepts<Promise<number>>(
  reduceAsync([1, 2], async (acc, value) => acc + value, reduceAsyncOptions),
);

async function* publicApiNumbers() {
  yield 1;
  yield 2;
}
accepts<Promise<number>>(
  reduceIterAsync(
    publicApiNumbers(),
    (acc, value) => acc + value,
    reduceIterAsyncOptions,
  ),
);

// --- Timing ----------------------------------------------------------------

const sleepOptions: SleepOptions = { signal: new AbortController().signal };
sleep(1, sleepOptions);

// --- Concurrency -----------------------------------------------------------

const resolvers: PromiseResolvers<number> = withResolvers<number>();
accepts<Promise<number>>(resolvers.promise);
resolvers.resolve(1);
resolvers.reject(new Error('nope'));

// --- Flow ------------------------------------------------------------------

const rateLimitOptions: RateLimitRunOptions = { period: 1000 };
rateLimitRun(async (value: string) => value, 2, rateLimitOptions);
// @ts-expect-error The period is now named in the options object.
rateLimitRun(async (value: string) => value, 2, 1000);

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
set({ a: 1 }, stringPath, { value: 2 });
// A function at `value` is an updater, and is as valid as any other value.
set({ a: 1 }, stringPath, { value: (n: unknown) => n });

// --- Types -----------------------------------------------------------------

const currencyOptions: FormatCurrencyOptions = {
  currency: 'EUR',
  locale: 'de-DE',
};
accepts<string>(formatCurrency(1200, currencyOptions));
// @ts-expect-error Currency is now part of the options object.
formatCurrency(1200, 'EUR');

const ttlOptions: TtlCacheSetOptions = { ttl: 5000 };
const ttlCache = new TtlCache<string, number>(1000);
accepts<TtlCache<string, number>>(ttlCache.set('key', 1, ttlOptions));
// @ts-expect-error The per-entry TTL is now named in an options object.
ttlCache.set('key', 1, 5000);

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
const hex = color({ value: 'red', to: 'hex' });
assertType<Equals<typeof hex, string>>();

const packed = color({ value: 'red', to: 'number' });
assertType<Equals<typeof packed, number>>();

const rgbaObj = color({ value: 'red', to: 'rgba-object' });
assertType<Equals<typeof rgbaObj, RGBA>>();

const hslaObj = color({ value: 'red', to: 'hsla-object' });
assertType<Equals<typeof hslaObj, HSLA>>();

const oklchObj = color({ value: 'red', to: 'oklch-object' });
assertType<Equals<typeof oklchObj, OKLCH>>();

const rgbaArr = color({ value: 'red', to: 'rgba-array' });
assertType<Equals<typeof rgbaArr, [number, number, number, number]>>();

// A format known only to be a `ColorFormat` yields every possibility.
declare const runtimeFormat: ColorFormat;
accepts<ColorOutput>(color({ value: 'red', to: runtimeFormat }));

// `to` is optional, and its absence pins the result to hex's `string`.
const defaulted = color({ value: 'red' });
assertType<Equals<typeof defaulted, string>>();

// `from` names how to read an array, and is reachable from the entry point.
accepts<ColorSourceFormat>('hsla');
const fromHsla = color({ value: [220, 60, 50, 1], from: 'hsla', to: 'number' });
assertType<Equals<typeof fromHsla, number>>();
accepts<ColorConvert>({ value: 'red' });
accepts<ColorConvert<'rgb'>>({ value: 'red', from: 'rgba', to: 'rgb' });

// The derivatives forward the format, and default to 'hex' when it is omitted.
const lightened = colorLighten({ value: 'red', amount: 0.1 });
assertType<Equals<typeof lightened, string>>();

const mixed = colorMix({
  color1: 'red',
  color2: 'blue',
  weight: 0.5,
  to: 'rgba-object',
});
assertType<Equals<typeof mixed, RGBA>>();

const inverted = colorInvert({ value: 'red', to: 'number' });
assertType<Equals<typeof inverted, number>>();

const gray = colorGrayscale({ value: 'red' });
assertType<Equals<typeof gray, string>>();

// The option types are reachable from the entry point.
accepts<ColorAlphaOptions>({ value: 'red', amount: 0.5 });
accepts<ColorAlphaOptions<'rgba'>>({ value: 'red', amount: 0.5, to: 'rgba' });
accepts<ColorMixOptions>({ color1: 'red', color2: 'blue' });
accepts<ColorContrastOptions>({ color1: 'red', color2: 'blue' });
accepts<ColorIsReadableOptions>({ color1: 'red', color2: 'blue' });
accepts<ColorLightenOptions>({ value: 'red', amount: 0.5 });
accepts<ColorDarkenOptions>({ value: 'red', amount: 0.5 });
accepts<ColorDesaturateOptions>({ value: 'red', amount: 0.5 });
accepts<ColorSaturateOptions>({ value: 'red', amount: 0.5 });
accepts<ColorGrayscaleOptions>({ value: 'red' });
accepts<ColorInvertOptions>({ value: 'red' });
accepts<ColorRotateHueOptions>({ value: 'red', degrees: 120 });
accepts<ColorWCAGLevelOptions>({ color1: 'red', color2: 'blue' });

// The map must stay in step with the format union, or `ColorOutput` silently
// stops covering a format.
accepts<ColorFormat>('' as keyof ColorFormatMap);
accepts<keyof ColorFormatMap>('' as ColorFormat);

const level: AccessibilityLevel = 'AAA_Large';
colorIsReadable({ color1: 'white', color2: 'black', level });

// --- Encoding --------------------------------------------------------------

const base64UrlOptions: EncodeBase64UrlOptions = { pad: false };
encodeBase64Url(new Uint8Array([1]), base64UrlOptions);

const base32Options: EncodeBase32Options = { pad: false };
encodeBase32(new Uint8Array([1]), base32Options);

const spliceOptions: StringSpliceOptions = { deleteCount: 2, insert: '08' };
accepts<string>(stringSplice('2026-07-30', 5, spliceOptions));
const truncateOptions: TruncateOptions = { omission: '..' };
accepts<string>(truncate('hi-package', 8, truncateOptions));
const padOptions: PadOptions = { chars: '_-' };
accepts<string>(pad('abc', 8, padOptions));

const properOptions: IsSubsetOfOptions = { proper: true };
const supersetOptions: IsSupersetOfOptions = { proper: true };
accepts<boolean>(isSubsetOf([1], [1, 2], properOptions));
accepts<boolean>(isSupersetOf([1, 2], [1], supersetOptions));

const rangeOptions: InRangeOptions = { start: 0, end: 5 };
accepts<boolean>(inRange(3, rangeOptions));

// --- Semver ----------------------------------------------------------------

const parsed: Semver = semverParse('1.2.3-alpha.1+build.5');
accepts<number>(parsed.major);
accepts<(string | number)[]>(parsed.prerelease);
accepts<string[]>(parsed.build);

const release: SemverRelease = 'preminor';
semverIncrement('1.2.3', release);
const incrementOptions: SemverIncrementOptions = { identifier: 'beta' };
semverIncrement('1.2.3', release, incrementOptions);

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

// --- Flow ------------------------------------------------------------------

const limit: LimitRunFn = limitRun(2);
accepts<number>(limit.active);
accepts<number>(limit.pending);
accepts<number>(limit.concurrency);

// The gate must carry the task's own type through, not widen it.
const limited = limit(async () => 'a');
assertType<Equals<typeof limited, Promise<string>>>();
const limitedSync = limit(() => 1);
assertType<Equals<typeof limitedSync, Promise<number>>>();

const pollOptions: PollRunOptions<string> = {
  until: (value, attempt) => value === 'done' && attempt > 0,
  interval: 100,
  backoff: 'exponential',
  attempts: 5,
  timeout: 1000,
};
const polled = pollRun(() => 'done', pollOptions);
assertType<Equals<typeof polled, Promise<string>>>();

// --- Json ------------------------------------------------------------------

accepts<JsonValue>({ a: 1 });
accepts<JsonObject>({ a: 1 });
accepts<JsonArray>([1, 'a']);
const jsonOpts: TryStringifyJSONOptions = { space: 2, temporal: true };
accepts<string | undefined>(tryStringifyJSON({ a: 1 }, undefined, jsonOpts));
const jsonParseOpts: TryParseJSONOptions = {
  temporal: true,
  reviver: (_key, value) => value,
};
accepts<boolean>(isJSONValue({ a: 1 }));
accepts<Record<string, unknown> | undefined>(
  tryParseJSON('{"a":1}', undefined, jsonParseOpts),
);
