import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
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

    // Generate Types
    console.log('⏳ Generating type definitions...');
    execSync('tsc --emitDeclarationOnly --outDir dist --noEmit false', { stdio: 'inherit' });
    const dts = join(dist, 'index.d.ts');
    const dcts = join(dist, 'index.d.cts');
    if (existsSync(dts)) {
      copyFileSync(dts, dcts);
      console.log('✅ index.d.cts generated');
    }

    // Copy README & LICENSE to package root and dist
    const rootDir = resolve(root, '../../');
    const rootReadme = join(rootDir, 'README.md');
    if (existsSync(rootReadme)) {
      copyFileSync(rootReadme, join(root, 'README.md'));
      copyFileSync(rootReadme, join(dist, 'README.md'));
      console.log('✅ README.md copied to package root and dist');
    }
    const rootLicense = join(rootDir, 'LICENSE');
    if (existsSync(rootLicense)) {
      copyFileSync(rootLicense, join(root, 'LICENSE'));
      copyFileSync(rootLicense, join(dist, 'LICENSE'));
      console.log('✅ LICENSE copied to package root and dist');
    }

    // Copy docs to dist
    const docsSrc = join(root, 'docs');
    const docsDist = join(dist, 'docs');
    if (existsSync(docsSrc)) {
      execSync(`cp -r ${docsSrc} ${docsDist}`);
      console.log('✅ docs/ copied to dist/docs');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
