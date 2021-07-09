import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/esUtils.js',
    format: 'esm',
  },
  plugins: [typescript()],
  external: [],
};
