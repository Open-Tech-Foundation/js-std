/**
 * The `vi` surface used by the suite, backed by real libraries.
 *
 * Only 7 spec files touch `vi`, and only these members. Timer faking is
 * delegated to `@sinonjs/fake-timers` rather than hand-rolled — hand-rolled
 * clocks were the source of the flakiness this harness replaces.
 *
 * Assertions never advance the clock. Tests advance time explicitly or not at all.
 */
import FakeTimers from '@sinonjs/fake-timers';
import { fn, spyOn } from '@vitest/spy';

let clock: FakeTimers.InstalledClock | undefined;

function useFakeTimers() {
  if (clock) clock.uninstall();
  clock = FakeTimers.install({
    now: Date.now(),
    toFake: [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'Date',
    ],
    shouldAdvanceTime: false,
  });
}

function useRealTimers() {
  clock?.uninstall();
  clock = undefined;
}

/**
 * Sinon's `tick` already drains timer callbacks, but a callback that awaits a
 * promise resolves on the microtask queue, which `tick` does not flush. The
 * async variant is what specs should prefer; the sync one is kept because 24
 * call sites already use it.
 */
function advanceTimersByTime(ms: number) {
  clock?.tick(ms);
}

async function advanceTimersByTimeAsync(ms: number) {
  await clock?.tickAsync(ms);
}

export const vi = {
  fn,
  spyOn,
  useFakeTimers,
  useRealTimers,
  advanceTimersByTime,
  advanceTimersByTimeAsync,
  getRealDate: () => Date.now(),
};
