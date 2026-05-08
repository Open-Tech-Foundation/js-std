const DECIMAL_REGEX = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;

/**
 * A precision decimal arithmetic class that avoids floating-point errors.
 * Uses BigInt internally for exact integer arithmetic.
 */
export default class Decimal {
  private readonly value: string;

  constructor(value: number | string | Decimal) {
    if (value instanceof Decimal) {
      this.value = value.value;
    } else if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new Error(`Invalid Decimal value: ${value}`);
      }
      this.value = Decimal.numberToString(value);
      Decimal.validate(this.value);
    } else if (typeof value === 'string') {
      let s = value.trim();
      if (s.startsWith('+')) s = s.slice(1);
      if (s.startsWith('-.')) s = `-0${s.slice(1)}`;
      else if (s.startsWith('.')) s = `0${s}`;
      if (/[eE]/.test(s)) {
        s = Decimal.numberToString(Number(s));
      }
      Decimal.validate(s);
      this.value = s;
    } else {
      throw new Error('Invalid Decimal value');
    }
  }

  private static validate(s: string): void {
    if (!DECIMAL_REGEX.test(s)) {
      throw new Error(`Invalid Decimal value: ${s}`);
    }
  }

  private static numberToString(n: number): string {
    const s = String(n);
    const eIdx = s.search(/[eE]/);
    if (eIdx === -1) return s;

    const sign = s[0] === '-' ? '-' : '';
    const absPart = s.replace(/^[+-]/, '');
    const [mantissa, expPart] = absPart.split(/[eE]/);
    const exp = Number.parseInt(expPart, 10);
    const dotIdx = mantissa.indexOf('.');
    const digits = mantissa.replace('.', '');

    if (exp >= 0) {
      const dotPos = (dotIdx === -1 ? digits.length : dotIdx) + exp;
      const full = digits.padEnd(Math.max(digits.length, dotPos), '0');
      return `${sign}${full.slice(0, dotPos)}${dotPos < full.length ? `.${full.slice(dotPos)}` : ''}`;
    }

    const absExp = -exp;
    const dotPos = dotIdx === -1 ? digits.length : dotIdx;
    if (dotPos > absExp) {
      return `${sign}${digits.slice(0, dotPos - absExp)}.${digits.slice(dotPos - absExp)}`;
    }
    return `${sign}0.${'0'.repeat(absExp - dotPos)}${digits}`;
  }

  private static precision(s: string): number {
    const dot = s.indexOf('.');
    return dot === -1 ? 0 : s.length - dot - 1;
  }

  private static normalize(s: string): string {
    const dot = s.indexOf('.');
    if (dot === -1) return s;
    let r = s.replace(/0+$/, '');
    if (r.endsWith('.')) r = r.slice(0, -1);
    return r;
  }

  private static fromInt(value: bigint, decimals: number): string {
    if (decimals === 0) return Decimal.normalize(value.toString());
    const sign = value < 0n ? '-' : '';
    let s = value.toString().replace('-', '');
    while (s.length <= decimals) s = `0${s}`;
    const dotPos = s.length - decimals;
    const intPart = s.slice(0, dotPos);
    const fracPart = s.slice(dotPos);
    return Decimal.normalize(`${sign}${intPart || '0'}.${fracPart}`);
  }

  private static align(
    a: string,
    b: string,
  ): { intA: bigint; intB: bigint; decimals: number } {
    const signA = a.startsWith('-') ? -1n : 1n;
    const signB = b.startsWith('-') ? -1n : 1n;
    const absA = a.replace('-', '');
    const absB = b.replace('-', '');
    const decA = Decimal.precision(absA);
    const decB = Decimal.precision(absB);
    const maxDec = Math.max(decA, decB);
    const intStrA = absA.replace('.', '') + '0'.repeat(maxDec - decA);
    const intStrB = absB.replace('.', '') + '0'.repeat(maxDec - decB);
    return {
      intA: signA * BigInt(intStrA),
      intB: signB * BigInt(intStrB),
      decimals: maxDec,
    };
  }

  // --- Construction & representation ---

  toString(): string {
    return this.value;
  }

  toNumber(): number {
    return Number(this.value);
  }

  toFixed(dp: number): string {
    if (dp < 0) throw new Error('Decimal places must be non-negative');
    const dec = Decimal.precision(this.value);
    if (dec === dp) return this.value;
    if (dec < dp) {
      const dot = this.value.indexOf('.');
      const base = this.isZero() ? '0' : this.value;
      if (dot === -1) return `${base}.${'0'.repeat(dp)}`;
      return base + '0'.repeat(dp - dec);
    }
    const isNeg = this.value.startsWith('-');
    const absStr = this.value.replace('-', '');
    const intStr = absStr.replace('.', '');
    const rawInt = BigInt(intStr);
    const removeCount = dec - dp;
    const divisor = BigInt(10) ** BigInt(removeCount);
    const quotient = rawInt / divisor;
    const remainder = rawInt % divisor;
    const half = divisor / 2n;
    let resultInt = quotient;
    if (remainder >= half) {
      resultInt += 1n;
    }
    if (resultInt === 0n) return Decimal.fromInt(resultInt, dp);
    return Decimal.fromInt(isNeg ? -resultInt : resultInt, dp);
  }

  toJSON(): string {
    return this.value;
  }

  // --- Arithmetic ---

  add(other: Decimal | number | string): Decimal {
    const rhs = new Decimal(other);
    const { intA, intB, decimals } = Decimal.align(this.value, rhs.value);
    return new Decimal(Decimal.fromInt(intA + intB, decimals));
  }

  subtract(other: Decimal | number | string): Decimal {
    const rhs = new Decimal(other);
    const { intA, intB, decimals } = Decimal.align(this.value, rhs.value);
    return new Decimal(Decimal.fromInt(intA - intB, decimals));
  }

  multiply(other: Decimal | number | string): Decimal {
    const rhs = new Decimal(other);
    const decA = Decimal.precision(this.value);
    const decB = Decimal.precision(rhs.value);
    const signA = this.value.startsWith('-') ? -1n : 1n;
    const signB = rhs.value.startsWith('-') ? -1n : 1n;
    const absA = BigInt(this.value.replace('-', '').replace('.', ''));
    const absB = BigInt(rhs.value.replace('-', '').replace('.', ''));
    const result = signA * signB * absA * absB;
    return new Decimal(Decimal.fromInt(result, decA + decB));
  }

  divide(other: Decimal | number | string, decimalPlaces = 20): Decimal {
    const rhs = new Decimal(other);
    const decA = Decimal.precision(this.value);
    const decB = Decimal.precision(rhs.value);
    const signA = this.value.startsWith('-') ? -1n : 1n;
    const signB = rhs.value.startsWith('-') ? -1n : 1n;
    const absA = BigInt(this.value.replace('-', '').replace('.', ''));
    const absB = BigInt(rhs.value.replace('-', '').replace('.', ''));

    if (absB === 0n) throw new Error('Division by zero');

    const numerator = absA * BigInt(10) ** BigInt(decB + decimalPlaces + 1);
    const denominator = absB * BigInt(10) ** BigInt(decA);
    let resultInt = numerator / denominator;
    const lastDigit = resultInt % 10n;
    resultInt = resultInt / 10n;
    if (lastDigit >= 5n) resultInt += 1n;
    resultInt *= signA * signB;
    return new Decimal(Decimal.fromInt(resultInt, decimalPlaces));
  }

  modulo(other: Decimal | number | string): Decimal {
    const rhs = new Decimal(other);
    if (rhs.isZero()) throw new Error('Division by zero');
    const quotient = this.divide(rhs).truncate();
    return this.subtract(rhs.multiply(quotient));
  }

  negate(): Decimal {
    if (this.isZero()) return new Decimal('0');
    if (this.value.startsWith('-')) {
      return new Decimal(this.value.slice(1));
    }
    return new Decimal(`-${this.value}`);
  }

  abs(): Decimal {
    if (this.value.startsWith('-')) {
      return new Decimal(this.value.slice(1));
    }
    return new Decimal(this.value);
  }

  // --- Comparison ---

  equals(other: Decimal | number | string): boolean {
    return this.compareTo(other) === 0;
  }

  greaterThan(other: Decimal | number | string): boolean {
    return this.compareTo(other) > 0;
  }

  lessThan(other: Decimal | number | string): boolean {
    return this.compareTo(other) < 0;
  }

  greaterThanOrEqual(other: Decimal | number | string): boolean {
    return this.compareTo(other) >= 0;
  }

  lessThanOrEqual(other: Decimal | number | string): boolean {
    return this.compareTo(other) <= 0;
  }

  compareTo(other: Decimal | number | string): number {
    const rhs = new Decimal(other);
    const { intA, intB } = Decimal.align(this.value, rhs.value);
    if (intA < intB) return -1;
    if (intA > intB) return 1;
    return 0;
  }

  // --- Rounding & scaling ---

  round(dp = 0): Decimal {
    return new Decimal(this.toFixed(dp));
  }

  floor(): Decimal {
    const dot = this.value.indexOf('.');
    if (dot === -1) return new Decimal(this.value);
    if (this.value.startsWith('-')) {
      const intPart = this.value.slice(0, dot);
      return new Decimal(String(BigInt(intPart) - 1n));
    }
    return new Decimal(this.value.slice(0, dot));
  }

  ceil(): Decimal {
    const dot = this.value.indexOf('.');
    if (dot === -1) return new Decimal(this.value);
    if (this.value.startsWith('-')) {
      const intPart = this.value.slice(0, dot);
      if (BigInt(intPart) === 0n) return new Decimal('0');
      return new Decimal(intPart);
    }
    return new Decimal(String(BigInt(this.value.slice(0, dot)) + 1n));
  }

  truncate(): Decimal {
    const dot = this.value.indexOf('.');
    if (dot === -1) return new Decimal(this.value);
    const intPart = this.value.slice(0, dot);
    if (BigInt(intPart) === 0n) return new Decimal('0');
    return new Decimal(intPart);
  }

  // --- Introspection ---

  isZero(): boolean {
    const digits = this.value.replace('-', '').replace('.', '');
    return BigInt(digits) === 0n;
  }

  isNegative(): boolean {
    return this.value.startsWith('-') && !this.isZero();
  }

  isPositive(): boolean {
    return !this.value.startsWith('-') && !this.isZero();
  }

  isInteger(): boolean {
    const dot = this.value.indexOf('.');
    if (dot === -1) return true;
    const fracPart = this.value.slice(dot + 1);
    return /^0+$/.test(fracPart);
  }

  decimalPlaces(): number {
    const dot = this.value.indexOf('.');
    return dot === -1 ? 0 : this.value.length - dot - 1;
  }

  valueOf(): number {
    return Number(this.value);
  }

  [Symbol.toPrimitive](hint: string): number | string {
    if (hint === 'string') return this.value;
    return Number(this.value);
  }
}

export { Decimal };
