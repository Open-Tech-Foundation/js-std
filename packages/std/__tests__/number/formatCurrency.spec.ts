import { formatCurrency } from '../../src';

describe('Number', () => {
  test('formatCurrency', () => {
    expect(formatCurrency(1200, 'USD')).toMatch(/\$1,200\.00/);
    expect(formatCurrency(1200, 'EUR')).toMatch(/€1,200\.00/);
    expect(formatCurrency(1200, 'JPY')).toMatch(/¥1,200/);
    expect(formatCurrency(1200, 'INR')).toMatch(/₹1,200\.00/);
    expect(formatCurrency(1200, 'EUR', { locale: 'de-DE' })).toMatch(
      /1\.200,00\s*€/,
    );
    expect(formatCurrency(1200, 'USD', { display: 'code' })).toMatch(
      /USD\s*1,200\.00/,
    );
    expect(formatCurrency(1200, 'USD', { display: 'name' })).toMatch(
      /1,200\.00 US dollars/,
    );
    expect(formatCurrency(1200, 'USD', { maxFraction: 0 })).toBe('$1,200');
    expect(
      formatCurrency(1200, 'USD', { minFraction: 2, maxFraction: 2 }),
    ).toBe('$1,200.00');
  });
});
