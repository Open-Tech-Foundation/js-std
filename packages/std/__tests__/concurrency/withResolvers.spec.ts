import { withResolvers } from '../../src';

describe('Async > withResolvers', () => {
  test('resolve', async () => {
    const { promise, resolve, reject } = withResolvers();
    resolve('fulfilled');
    await expect(promise).resolves.toBe('fulfilled');
  });

  test('reject', async () => {
    const { promise, resolve, reject } = withResolvers();

    reject(new Error('Rejected'));
    await expect(promise).rejects.toThrow('Rejected');
  });
});
