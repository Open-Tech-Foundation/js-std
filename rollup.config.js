import typescript from '@rollup/plugin-typescript';
import clean from '@open-tech-world/rollup-plugin-clean';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'lib',
    format: 'esm',
  },
  plugins: [clean('lib/**'), typescript({ tsconfig: './tsconfig.json' })],
  external: [],
};
