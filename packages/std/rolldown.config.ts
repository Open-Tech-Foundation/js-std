import { copyFileSync, cpSync, existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { type Plugin, defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

const root = process.cwd();
const dist = join(root, 'dist');
const rootDir = resolve(root, '../../');

// Wipes dist once, before the first of the three builds writes to it.
const clean: Plugin = {
  name: 'clean-dist',
  buildStart() {
    rmSync(dist, { recursive: true, force: true });
  },
};

// Ships README, LICENSE and the per-function docs inside the tarball.
const copyAssets: Plugin = {
  name: 'copy-assets',
  writeBundle() {
    const readme = join(rootDir, 'README.md');
    if (existsSync(readme)) {
      copyFileSync(readme, join(root, 'README.md'));
      copyFileSync(readme, join(dist, 'README.md'));
    }

    const license = join(rootDir, 'LICENSE');
    if (existsSync(license)) {
      copyFileSync(license, join(root, 'LICENSE'));
      copyFileSync(license, join(dist, 'LICENSE'));
    }

    const docs = join(root, 'docs');
    if (existsSync(docs)) {
      cpSync(docs, join(dist, 'docs'), { recursive: true });
    }
  },
};

// The declarations are format-agnostic — no `export =` anywhere — so the CJS
// entry can reuse them verbatim. rolldown-plugin-dts refuses to run against a
// CJS output, and emitting a second, identical bundle would be the only other
// way to fill the `require.types` slot.
const copyDeclarations: Plugin = {
  name: 'copy-declarations',
  writeBundle() {
    copyFileSync(join(dist, 'index.d.ts'), join(dist, 'index.d.cts'));
  },
};

// `platform: 'neutral'` keeps the output free of any runtime's globals, which
// the package requires — see the runtime matrix under __tests__/_matrix.
const shared = {
  input: 'src/index.ts',
  platform: 'neutral',
} as const;

export default defineConfig([
  // ESM, one file per module. A single merged bundle cannot be tree-shaken
  // per function: module-level tables (the CSS colour names, the diacritics
  // map) carry initialisers a bundler cannot prove pure, so every import
  // retained them. `sideEffects: false` does not help there — it drops whole
  // modules, and merging leaves none to drop.
  {
    ...shared,
    plugins: [clean],
    output: {
      dir: dist,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: join(root, 'src'),
      entryFileNames: '[name].js',
      minify: true,
      sourcemap: true,
    },
  },

  // CJS stays a single bundle: `require` consumers do not tree-shake anyway.
  {
    ...shared,
    output: {
      file: join(dist, 'index.cjs'),
      format: 'cjs',
      minify: true,
      sourcemap: true,
    },
  },

  // Declarations, bundled into a single index.d.ts. `emitDtsOnly` matters:
  // without it this pass also writes its intermediate index.js over the ESM
  // entry the first build produced.
  {
    ...shared,
    plugins: [dts({ emitDtsOnly: true }), copyDeclarations, copyAssets],
    output: { dir: dist, format: 'esm' },
  },
]);
