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

import { pascalCase } from '../../src';

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
