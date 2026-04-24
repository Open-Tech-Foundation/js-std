import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import * as esbuild from 'esbuild';

const root = process.cwd();
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  mkdirSync(dist);
}

const baseConfig: esbuild.BuildOptions = {
  entryPoints: [join(root, 'src/index.ts')],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'node',
  target: 'esnext',
};

async function build() {
  console.log('🚀 Building @opentf/std...');

  try {
    // ESM build
    await esbuild.build({
      ...baseConfig,
      format: 'esm',
      outfile: join(dist, 'index.js'),
    });
    console.log('✅ ESM build completed');

    // CJS build
    await esbuild.build({
      ...baseConfig,
      format: 'cjs',
      outfile: join(dist, 'index.cjs'),
    });
    console.log('✅ CJS build completed');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
