import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { formatCurrency } from '../../src';

describe('Number', () => {
  test('formatCurrency', () => {
    expect(formatCurrency(1200, { currency: 'USD' })).toMatch(/\$1,200\.00/);
    expect(formatCurrency(1200, { currency: 'EUR' })).toMatch(/€1,200\.00/);
    expect(formatCurrency(1200, { currency: 'JPY' })).toMatch(/¥1,200/);
    expect(formatCurrency(1200, { currency: 'INR' })).toMatch(/₹1,200\.00/);
    expect(formatCurrency(1200, { currency: 'EUR', locale: 'de-DE' })).toMatch(
      /1\.200,00\s*€/,
    );
    expect(formatCurrency(1200, { currency: 'USD', display: 'code' })).toMatch(
      /USD\s*1,200\.00/,
    );
    expect(formatCurrency(1200, { currency: 'USD', display: 'name' })).toMatch(
      /1,200\.00 US dollars/,
    );
    expect(formatCurrency(1200, { currency: 'USD', maxFraction: 0 })).toBe(
      '$1,200',
    );
    expect(
      formatCurrency(1200, {
        currency: 'USD',
        minFraction: 2,
        maxFraction: 2,
      }),
    ).toBe('$1,200.00');
    expect(() => formatCurrency(1200, { currency: 'US' })).toThrow(
      'The currency code must be a 3-letter ISO 4217 string.',
    );
    expect(() =>
      formatCurrency(1200, { currency: 'USD', minFraction: -1 }),
    ).toThrow('The minFraction option must be an integer between 0 and 100.');
    expect(() =>
      formatCurrency(1200, { currency: 'USD', maxFraction: 1.5 }),
    ).toThrow('The maxFraction option must be an integer between 0 and 100.');
    expect(() =>
      formatCurrency(1200, { currency: 'USD', display: 'wide' as never }),
    ).toThrow("The display option must be one of 'symbol', 'code', or 'name'.");
    expect(() =>
      formatCurrency(1200, {
        currency: 'USD',
        minFraction: 3,
        maxFraction: 2,
      }),
    ).toThrow(
      'The minFraction option must be less than or equal to maxFraction.',
    );
  });
});
