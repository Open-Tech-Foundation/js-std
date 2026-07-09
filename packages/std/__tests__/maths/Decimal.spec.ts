import { describe, expect, test } from 'vitest';
import Decimal from '../../src/maths/Decimal';

describe('Decimal > Construction', () => {
  test('constructs from string', () => {
    expect(new Decimal('0.1').toString()).toBe('0.1');
    expect(new Decimal('123.456').toString()).toBe('123.456');
    expect(new Decimal('-3.14').toString()).toBe('-3.14');
    expect(new Decimal('0').toString()).toBe('0');
    expect(new Decimal('100').toString()).toBe('100');
  });

  test('constructs from number', () => {
    expect(new Decimal(0.1).toString()).toBe('0.1');
    expect(new Decimal(123).toString()).toBe('123');
    expect(new Decimal(-3.14).toString()).toBe('-3.14');
    expect(new Decimal(0).toString()).toBe('0');
  });

  test('constructs from Decimal', () => {
    const a = new Decimal('0.1');
    const b = new Decimal(a);
    expect(b.toString()).toBe('0.1');
  });

  test('constructs from scientific notation', () => {
    expect(new Decimal(1e-7).toString()).toBe('0.0000001');
    expect(new Decimal(1e21).toString()).toBe('1000000000000000000000');
    expect(new Decimal(1.5e-7).toString()).toBe('0.00000015');
    expect(new Decimal(-1.23e4).toString()).toBe('-12300');
  });

  test('accepts trimmed whitespace', () => {
    expect(new Decimal('  1.5  ').toString()).toBe('1.5');
    expect(new Decimal('  -3.14  ').toString()).toBe('-3.14');
  });

  test('accepts explicit positive sign', () => {
    expect(new Decimal('+1.5').toString()).toBe('1.5');
    expect(new Decimal('+0.5').toString()).toBe('0.5');
  });

  test('accepts leading dot notation', () => {
    expect(new Decimal('.5').toString()).toBe('0.5');
    expect(new Decimal('-.5').toString()).toBe('-0.5');
    expect(new Decimal('.123').toString()).toBe('0.123');
    expect(new Decimal('-0.5').toString()).toBe('-0.5');
  });

  test('handles extreme JS numbers', () => {
    expect(new Decimal(Number.MAX_SAFE_INTEGER).toString()).toBe(
      '9007199254740991',
    );
    expect(new Decimal(Number.MIN_SAFE_INTEGER).toString()).toBe(
      '-9007199254740991',
    );
    expect(new Decimal(Number.EPSILON).toString()).toBe(
      '0.0000000000000002220446049250313',
    );
  });

  test('handles already-imprecise number input', () => {
    expect(new Decimal(0.1 + 0.2).toString()).toBe('0.30000000000000004');
    expect(new Decimal(1 / 3).toString()).toBe('0.3333333333333333');
  });

  test('throws on invalid inputs', () => {
    expect(() => new Decimal('')).toThrow();
    expect(() => new Decimal('3.')).toThrow();
    expect(() => new Decimal('abc')).toThrow();
    expect(() => new Decimal('1.2.3')).toThrow();
    expect(() => new Decimal('1,000.50')).toThrow();
    expect(() => new Decimal('1_000.50')).toThrow();
    expect(() => new Decimal(Number.POSITIVE_INFINITY)).toThrow();
    expect(() => new Decimal(Number.NEGATIVE_INFINITY)).toThrow();
    expect(() => new Decimal(Number.NaN)).toThrow();
  });
});

describe('Decimal > Representation', () => {
  test('toString', () => {
    expect(new Decimal('3.14').toString()).toBe('3.14');
    expect(new Decimal('-0.5').toString()).toBe('-0.5');
    expect(new Decimal('100').toString()).toBe('100');
  });

  test('toNumber', () => {
    expect(new Decimal('3.14').toNumber()).toBe(3.14);
    expect(new Decimal('100').toNumber()).toBe(100);
    expect(new Decimal('-0.5').toNumber()).toBe(-0.5);
    expect(new Decimal('0.000001').toNumber()).toBe(0.000001);
    expect(new Decimal('0.0000001').toNumber()).toBe(1e-7);
  });

  test('toFixed', () => {
    expect(new Decimal('3.14159').toFixed(2)).toBe('3.14');
    expect(new Decimal('3.14159').toFixed(4)).toBe('3.1416');
    expect(new Decimal('3').toFixed(2)).toBe('3.00');
    expect(new Decimal('3.1').toFixed(2)).toBe('3.10');
    expect(new Decimal('0.005').toFixed(2)).toBe('0.01');
    expect(new Decimal('3.145').toFixed(2)).toBe('3.15');
    expect(new Decimal('-3.145').toFixed(2)).toBe('-3.15');
    expect(new Decimal('0').toFixed(3)).toBe('0.000');
    expect(new Decimal('-0').toFixed(2)).toBe('0.00');
  });

  test('toFixed - classic 1.005 trap', () => {
    expect(new Decimal('1.005').toFixed(2)).toBe('1.01');
  });

  test('toFixed - very large numbers', () => {
    expect(new Decimal('1e20').toFixed(2)).toBe('100000000000000000000.00');
  });

  test('toFixed throws on negative dp', () => {
    expect(() => new Decimal('3.14').toFixed(-1)).toThrow();
  });

  test('toJSON returns string for safe serialization', () => {
    const d = new Decimal('3.14');
    expect(JSON.stringify(d)).toBe('"3.14"');
    expect(JSON.stringify({ price: new Decimal('1.99') })).toBe(
      '{"price":"1.99"}',
    );
  });

  test('valueOf', () => {
    expect(new Decimal('3.14').valueOf()).toBe(3.14);
    expect(new Decimal('0').valueOf()).toBe(0);
  });

  test('Symbol.toPrimitive', () => {
    const d = new Decimal('1.5');
    expect(`${d}`).toBe('1.5');
    expect(+d).toBe(1.5);
  });
});

describe('Decimal > Arithmetic', () => {
  test('add - classic floating point cases', () => {
    expect(new Decimal('0.1').add('0.2').toString()).toBe('0.3');
    expect(new Decimal('0.1').add(0.2).toString()).toBe('0.3');
    expect(new Decimal(0.1).add(0.2).toString()).toBe('0.3');
  });

  test('add - very different magnitudes', () => {
    expect(new Decimal('1e20').add('0.0001').toString()).toBe(
      '100000000000000000000.0001',
    );
  });

  test('add - arbitrarily large BigInt', () => {
    const a = new Decimal('9'.repeat(100));
    const b = new Decimal('1');
    expect(a.add(b).toString()).toBe(`1${'0'.repeat(100)}`);
  });

  test('add - identity preservation', () => {
    const a = new Decimal('1');
    const b = a.add(new Decimal('2'));
    expect(a.toNumber()).toBe(1);
    expect(b.toNumber()).toBe(3);
  });

  test('subtract', () => {
    expect(new Decimal('0.3').subtract('0.1').toString()).toBe('0.2');
    expect(new Decimal('5').subtract('3').toString()).toBe('2');
    expect(new Decimal('-1').subtract('-2').toString()).toBe('1');
    expect(new Decimal('0.0003').subtract('0.0001').toString()).toBe('0.0002');
  });

  test('multiply', () => {
    expect(new Decimal('0.5').multiply('0.5').toString()).toBe('0.25');
    expect(new Decimal('0.1').multiply('0.1').toString()).toBe('0.01');
    expect(new Decimal('3').multiply('4').toString()).toBe('12');
    expect(new Decimal('-2').multiply('3').toString()).toBe('-6');
    expect(new Decimal('-2').multiply('-3').toString()).toBe('6');
    expect(new Decimal('1.5').multiply('2').toString()).toBe('3');
  });

  test('multiply - large precision', () => {
    const result = new Decimal('9999999.9999').multiply('9999999.9999');
    expect(result.toString()).toBe('99999999998000.00000001');
  });

  test('divide', () => {
    expect(new Decimal('1').divide('3', 10).toString()).toBe('0.3333333333');
    expect(new Decimal('2').divide('3', 10).toString()).toBe('0.6666666667');
    expect(new Decimal('10').divide('2').toString()).toBe('5');
    expect(new Decimal('1').divide('4').toString()).toBe('0.25');
    expect(new Decimal('-1').divide('3', 2).toString()).toBe('-0.33');
    expect(new Decimal('0').divide('5').toString()).toBe('0');
  });

  test('divide by zero throws', () => {
    expect(() => new Decimal('1').divide('0')).toThrow('Division by zero');
    expect(() => new Decimal('0').divide('0')).toThrow('Division by zero');
  });

  test('modulo', () => {
    expect(new Decimal('7').modulo('3').toString()).toBe('1');
    expect(new Decimal('-7').modulo('3').toString()).toBe('-1');
    expect(new Decimal('7').modulo('-3').toString()).toBe('1');
    expect(new Decimal('-7').modulo('-3').toString()).toBe('-1');
    expect(new Decimal('7.5').modulo('2.5').toString()).toBe('0');
  });

  test('modulo by zero throws', () => {
    expect(() => new Decimal('5').modulo('0')).toThrow('Division by zero');
  });

  test('self-addition does not mutate', () => {
    const d = new Decimal('1.5');
    const result = d.add(d);
    expect(d.toString()).toBe('1.5');
    expect(result.toString()).toBe('3');
  });

  test('negate', () => {
    expect(new Decimal('3.14').negate().toString()).toBe('-3.14');
    expect(new Decimal('-3.14').negate().toString()).toBe('3.14');
    expect(new Decimal('0').negate().toString()).toBe('0');
  });

  test('abs', () => {
    expect(new Decimal('3.14').abs().toString()).toBe('3.14');
    expect(new Decimal('-3.14').abs().toString()).toBe('3.14');
    expect(new Decimal('0').abs().toString()).toBe('0');
  });
});

describe('Decimal > Comparison', () => {
  test('equals', () => {
    expect(new Decimal('0.1').add('0.2').equals('0.3')).toBe(true);
    expect(new Decimal('1').equals('1.0')).toBe(true);
    expect(new Decimal('1').equals('2')).toBe(false);
  });

  test('equals - negative zero', () => {
    expect(new Decimal('0').equals(new Decimal('-0'))).toBe(true);
  });

  test('equals - different precision representations', () => {
    expect(new Decimal('1.0').equals(new Decimal('1.00'))).toBe(true);
    expect(new Decimal('1.10').equals(new Decimal('1.1'))).toBe(true);
  });

  test('equals - cross type', () => {
    expect(new Decimal('1.5').equals(1.5)).toBe(true);
  });

  test('greaterThan', () => {
    expect(new Decimal('5').greaterThan('3')).toBe(true);
    expect(new Decimal('3').greaterThan('5')).toBe(false);
    expect(new Decimal('3').greaterThan('3')).toBe(false);
  });

  test('lessThan', () => {
    expect(new Decimal('3').lessThan('5')).toBe(true);
    expect(new Decimal('5').lessThan('3')).toBe(false);
    expect(new Decimal('3').lessThan('3')).toBe(false);
  });

  test('greaterThanOrEqual', () => {
    expect(new Decimal('5').greaterThanOrEqual('3')).toBe(true);
    expect(new Decimal('3').greaterThanOrEqual('3')).toBe(true);
    expect(new Decimal('2').greaterThanOrEqual('3')).toBe(false);
  });

  test('lessThanOrEqual', () => {
    expect(new Decimal('3').lessThanOrEqual('5')).toBe(true);
    expect(new Decimal('3').lessThanOrEqual('3')).toBe(true);
    expect(new Decimal('4').lessThanOrEqual('3')).toBe(false);
  });

  test('compareTo', () => {
    expect(new Decimal('3').compareTo('5')).toBe(-1);
    expect(new Decimal('5').compareTo('3')).toBe(1);
    expect(new Decimal('3').compareTo('3')).toBe(0);
    expect(new Decimal('-1').compareTo('0')).toBe(-1);
    expect(new Decimal('0').compareTo('-1')).toBe(1);
  });

  test('compareTo throws on null', () => {
    expect(() => new Decimal('1').compareTo(null as any)).toThrow();
  });
});

describe('Decimal > Rounding', () => {
  test('round', () => {
    expect(new Decimal('3.14159').round(2).toString()).toBe('3.14');
    expect(new Decimal('3.145').round(2).toString()).toBe('3.15');
    expect(new Decimal('3.5').round().toString()).toBe('4');
    expect(new Decimal('2.5').round().toString()).toBe('3');
    expect(new Decimal('-3.5').round().toString()).toBe('-4');
    expect(new Decimal('-2.5').round().toString()).toBe('-3');
  });

  test('round half-up on negatives', () => {
    expect(new Decimal('-0.5').round().toString()).toBe('-1');
    expect(new Decimal('-1.5').round().toString()).toBe('-2');
  });

  test('round negative dp throws', () => {
    expect(() => new Decimal('1234.5').round(-2)).toThrow();
  });

  test('floor', () => {
    expect(new Decimal('3.14').floor().toString()).toBe('3');
    expect(new Decimal('-3.14').floor().toString()).toBe('-4');
    expect(new Decimal('3').floor().toString()).toBe('3');
    expect(new Decimal('0.5').floor().toString()).toBe('0');
    expect(new Decimal('-0.5').floor().toString()).toBe('-1');
    expect(new Decimal('-1.1').floor().toString()).toBe('-2');
  });

  test('ceil', () => {
    expect(new Decimal('3.14').ceil().toString()).toBe('4');
    expect(new Decimal('-3.14').ceil().toString()).toBe('-3');
    expect(new Decimal('3').ceil().toString()).toBe('3');
    expect(new Decimal('0.5').ceil().toString()).toBe('1');
    expect(new Decimal('-0.5').ceil().toString()).toBe('0');
    expect(new Decimal('-1.1').ceil().toString()).toBe('-1');
  });

  test('truncate', () => {
    expect(new Decimal('3.14').truncate().toString()).toBe('3');
    expect(new Decimal('-3.14').truncate().toString()).toBe('-3');
    expect(new Decimal('3').truncate().toString()).toBe('3');
    expect(new Decimal('0.5').truncate().toString()).toBe('0');
    expect(new Decimal('-0.5').truncate().toString()).toBe('0');
    expect(new Decimal('-1.9').truncate().toString()).toBe('-1');
  });
});

describe('Decimal > Introspection', () => {
  test('isZero', () => {
    expect(new Decimal('0').isZero()).toBe(true);
    expect(new Decimal('0.0').isZero()).toBe(true);
    expect(new Decimal('-0').isZero()).toBe(true);
    expect(new Decimal('3').isZero()).toBe(false);
  });

  test('isNegative', () => {
    expect(new Decimal('-3').isNegative()).toBe(true);
    expect(new Decimal('3').isNegative()).toBe(false);
    expect(new Decimal('0').isNegative()).toBe(false);
    expect(new Decimal('-0').isNegative()).toBe(false);
  });

  test('isPositive', () => {
    expect(new Decimal('3').isPositive()).toBe(true);
    expect(new Decimal('-3').isPositive()).toBe(false);
    expect(new Decimal('0').isPositive()).toBe(false);
  });

  test('isInteger', () => {
    expect(new Decimal('3').isInteger()).toBe(true);
    expect(new Decimal('3.0').isInteger()).toBe(true);
    expect(new Decimal('3.14').isInteger()).toBe(false);
    expect(new Decimal('-3').isInteger()).toBe(true);
    expect(new Decimal('0').isInteger()).toBe(true);
  });

  test('decimalPlaces', () => {
    expect(new Decimal('3.14').decimalPlaces()).toBe(2);
    expect(new Decimal('3').decimalPlaces()).toBe(0);
    expect(new Decimal('3.1').decimalPlaces()).toBe(1);
    expect(new Decimal('0.0001').decimalPlaces()).toBe(4);
    expect(new Decimal('-3.14').decimalPlaces()).toBe(2);
  });
});

describe('Decimal > Classic FP precision fixes', () => {
  test('0.1 + 0.2 === 0.3', () => {
    const result = new Decimal('0.1').add('0.2');
    expect(result.equals('0.3')).toBe(true);
    expect(result.toString()).toBe('0.3');
  });

  test('0.3 - 0.1 === 0.2', () => {
    const result = new Decimal('0.3').subtract('0.1');
    expect(result.equals('0.2')).toBe(true);
    expect(result.toString()).toBe('0.2');
  });

  test('0.1 * 0.1 === 0.01', () => {
    const result = new Decimal('0.1').multiply('0.1');
    expect(result.equals('0.01')).toBe(true);
  });

  test('0.3 / 0.1 === 3', () => {
    const result = new Decimal('0.3').divide('0.1', 10);
    expect(result.equals('3')).toBe(true);
  });

  test('chained operations', () => {
    const result = new Decimal('0.1')
      .add('0.2')
      .multiply('3')
      .subtract('0.5')
      .divide('2', 10);
    expect(result.toString()).toBe('0.2');
  });

  test('large integer precision', () => {
    const a = new Decimal('9999999999999999');
    const b = new Decimal('1');
    expect(a.add(b).toString()).toBe('10000000000000000');
  });

  test('round half up', () => {
    expect(new Decimal('2.5').round().toString()).toBe('3');
    expect(new Decimal('3.5').round().toString()).toBe('4');
    expect(new Decimal('-2.5').round().toString()).toBe('-3');
  });
});

describe('Decimal > Chaining & immutability', () => {
  test('method chaining returns Decimal instances', () => {
    const result = new Decimal('10')
      .subtract('4')
      .multiply('2')
      .divide('3', 10);
    expect(result).toBeInstanceOf(Decimal);
    expect(result.toString()).toBe('4');
  });

  test('chaining does not mutate original', () => {
    const a = new Decimal('1');
    const b = a.add(new Decimal('2'));
    expect(a.toNumber()).toBe(1);
    expect(b.toNumber()).toBe(3);
  });
});

describe('Decimal > Edge cases', () => {
  test('very small numbers', () => {
    const d = new Decimal('0.0000000001');
    expect(d.toString()).toBe('0.0000000001');
    expect(d.decimalPlaces()).toBe(10);
  });

  test('very large numbers', () => {
    const d = new Decimal('12345678901234567890');
    expect(d.toString()).toBe('12345678901234567890');
  });

  test('arbitrarily large BigInt', () => {
    const d = new Decimal('9'.repeat(1000)).add('1');
    expect(d.toString()).toBe(`1${'0'.repeat(1000)}`);
  });

  test('zero handling', () => {
    const z = new Decimal('0');
    expect(z.isZero()).toBe(true);
    expect(z.isNegative()).toBe(false);
    expect(z.isPositive()).toBe(false);
    expect(z.negate().toString()).toBe('0');
    expect(z.abs().toString()).toBe('0');
  });

  test('negative zero', () => {
    const z = new Decimal('-0');
    expect(z.isZero()).toBe(true);
    expect(z.isNegative()).toBe(false);
    expect(z.isPositive()).toBe(false);
    expect(z.negate().toString()).toBe('0');
  });
});

describe('Decimal > Integration with existing codebase', () => {
  test('imported from index', async () => {
    const mod = await import('../../src');
    expect(mod.Decimal).toBeDefined();
    const d = new mod.Decimal('0.1');
    expect(d.add('0.2').equals('0.3')).toBe(true);
  });
});
