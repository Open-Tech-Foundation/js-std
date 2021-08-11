import { pascalCase } from '../../lib/index.esm.js';

describe('String', () => {
  test('pascalCase', () => {
    expect(() => pascalCase()).toThrow();
    expect(pascalCase('na cl')).toBe('NaCl');
    expect(pascalCase('Foo-Bar')).toBe('FooBar');
    expect(pascalCase('fooBAR')).toBe('FooBar');
    expect(pascalCase('react_component')).toBe('ReactComponent');
    expect(pascalCase('--foo.bar')).toBe('FooBar');
    expect(pascalCase('__foo__--bar')).toBe('FooBar');
    expect(pascalCase('cinema Scope')).toBe('CinemaScope');
  });
});
