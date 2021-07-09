import esUtils from '../lib/esUtils.js';

describe('esUtils', () => {
  test('index', () => {
    expect(esUtils()).toMatch(/Hello World!/);
  });
});
