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
  BatchRunOptions,
  ColorInput,
  EncodeBase32Options,
  EncodeBase64UrlOptions,
  IdleRunFn,
  IdleRunOptions,
  IsEqlOptions,
  MemoizeRunFn,
  MemoizeRunOptions,
  OrderTuples,
  OrderType,
  PaceRunFn,
  PaceRunOptions,
  PromiseResolvers,
  RetryRunOptions,
  Semver,
  SemverRelease,
  SemverSatisfiesOptions,
  SleepOptions,
  SortCB,
  StreamToIterOptions,
  StringReplaceOptions,
  TimeoutRunOptions,
  TypedArray,
  WordWrapOptions,
} from '../../src';
import {
  batchRun,
  color,
  encodeBase32,
  encodeBase64Url,
  idleRun,
  isEql,
  memoizeRun,
  paceRun,
  retryRun,
  semverIncrement,
  semverParse,
  semverSatisfies,
  sleep,
  sort,
  sortBy,
  streamToIter,
  stringReplace,
  timeoutRun,
  withResolvers,
  wordWrap,
} from '../../src';

/** Fails to compile unless `Actual` is assignable to `Expected`. */
function accepts<Expected>(_value: Expected): void {}

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

// --- String ----------------------------------------------------------------

const replaceOptions: StringReplaceOptions = { all: true, case: false };
stringReplace('a-b', '-', '+', replaceOptions);

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
color('red', 'hex');

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
