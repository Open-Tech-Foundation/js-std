/**
 * Real Jest/Vitest matcher semantics, assembled from `@vitest/expect`.
 *
 * We deliberately do NOT hand-roll equality: `@opentf/std`'s core competence is
 * precision comparison (`isEql`, `Decimal`), so a home-grown `toEqual` that
 * disagrees with the reference implementation would be worse than no test at all.
 */
import {
  Any,
  Anything,
  ArrayContaining,
  JestAsymmetricMatchers,
  JestChaiExpect,
  JestExtend,
  ObjectContaining,
  StringContaining,
  StringMatching,
  chai,
} from '@vitest/expect';

chai.use(JestExtend);
chai.use(JestChaiExpect);
chai.use(JestAsymmetricMatchers);

type ExpectFn = ((value: unknown) => any) & Record<string, unknown>;

export const expect = ((value: unknown) => chai.expect(value)) as ExpectFn;

expect.anything = () => new Anything();
expect.any = (ctor: unknown) => new Any(ctor);
expect.arrayContaining = (arr: unknown[]) => new ArrayContaining(arr);
expect.objectContaining = (obj: object) => new ObjectContaining(obj);
expect.stringContaining = (s: string) => new StringContaining(s);
expect.stringMatching = (s: string | RegExp) => new StringMatching(s);
