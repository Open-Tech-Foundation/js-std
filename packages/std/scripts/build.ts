import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  mkdirSync(dist);
}

function runBunX(args: string[]) {
  execFileSync(process.execPath, ['x', ...args], { stdio: 'inherit' });
}

function buildBundle(format: 'esm' | 'cjs', outfile: string) {
  runBunX([
    'esbuild',
    'src/index.ts',
    '--bundle',
    '--minify',
    '--sourcemap',
    '--platform=node',
    '--target=esnext',
    `--format=${format}`,
    `--outfile=${outfile}`,
  ]);
}

async function build() {
  console.log('🚀 Building @opentf/std...');

  try {
    // ESM build
    buildBundle('esm', join(dist, 'index.js'));
    console.log('✅ ESM build completed');

    // CJS build
    buildBundle('cjs', join(dist, 'index.cjs'));
    console.log('✅ CJS build completed');

    // Generate Types
    console.log('⏳ Generating type definitions...');
    runBunX(['tsc', '--emitDeclarationOnly', '--outDir', 'dist', '--noEmit', 'false']);
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
      cpSync(docsSrc, docsDist, { recursive: true });
      console.log('✅ docs/ copied to dist/docs');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

await build();
