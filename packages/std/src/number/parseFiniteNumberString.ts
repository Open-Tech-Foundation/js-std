export default function parseFiniteNumberString(val: string): number {
  const trimmed = val.trim();

  if (!trimmed.length) {
    return Number.NaN;
  }

  if (trimmed.includes('_')) {
    const isValidSeparatedNumber =
      /^(?:[+-]?(?:(?:0|[1-9](?:_?\d)*)(?:\.\d(?:_?\d)*)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|0[bB][01](?:_?[01])*|0[oO][0-7](?:_?[0-7])*|0[xX][\da-fA-F](?:_?[\da-fA-F])*)$/.test(
        trimmed,
      );

    if (!isValidSeparatedNumber) {
      return Number.NaN;
    }
  }

  const normalized = trimmed.replaceAll('_', '');
  const n = Number(normalized);

  return Number.isFinite(n) ? n : Number.NaN;
}
