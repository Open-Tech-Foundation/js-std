import { isEmail } from '../../lib/esUtils.js';

describe('String', () => {
  test('isEmail', () => {
    expect(isEmail()).toBeFalsy();
    expect(isEmail(null)).toBeFalsy();
    expect(isEmail(1)).toBeFalsy();
    expect(isEmail('')).toBeFalsy();
    expect(isEmail('a')).toBeFalsy();
    expect(isEmail('example.com')).toBeFalsy();
    expect(isEmail('user@')).toBeFalsy();
    expect(isEmail('user@domain')).toBeFalsy();
    expect(isEmail('user@domain.')).toBeFalsy();
    expect(isEmail('user@domain.c')).toBeTruthy();
    expect(isEmail('$user@domain.c')).toBeTruthy();
    expect(isEmail('user@example.com')).toBeTruthy();
    expect(isEmail('sub-domain.user@example.com')).toBeTruthy();
    expect(isEmail('sub-domain.sub2.user@example.com')).toBeTruthy();
    expect(isEmail('user@example.js.org')).toBeTruthy();
    expect(isEmail('user@example.js.org.')).toBeFalsy();
    expect(isEmail('User@example.js.org')).toBeFalsy();
    expect(isEmail('User@@example.js.org')).toBeFalsy();
    expect(isEmail('User@domain@example.js.org')).toBeFalsy();
    expect(isEmail('test.email.with+symbol@domain.com')).toBeTruthy();
    expect(isEmail('email@example@example.com')).toBeFalsy();
  });
});
