export default function parseFiniteNumberString(val: string): number {
  if (!val.trim().length) {
    return Number.NaN;
  }

  const invalidSeparator = /_{2,}|^0_1|^_|_$/;
  const normalized =
    val.includes('_') && !invalidSeparator.test(val.trim())
      ? val.replaceAll('_', '')
      : val;
  const n = Number(normalized);

  return Number.isFinite(n) ? n : Number.NaN;
}
