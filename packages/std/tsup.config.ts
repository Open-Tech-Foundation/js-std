import { copyFileSync, cpSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
      dts: format === 'cjs' ? '.d.cts' : '.d.ts',
    };
  },
  async onSuccess() {
    const root = process.cwd();
    const dist = join(root, 'dist');

    // Copy README & LICENSE from workspace root
    const rootDir = resolve(root, '../../');
    const rootReadme = join(rootDir, 'README.md');
    if (existsSync(rootReadme)) {
      copyFileSync(rootReadme, join(root, 'README.md'));
      copyFileSync(rootReadme, join(dist, 'README.md'));
    }
    const rootLicense = join(rootDir, 'LICENSE');
    if (existsSync(rootLicense)) {
      copyFileSync(rootLicense, join(root, 'LICENSE'));
      copyFileSync(rootLicense, join(dist, 'LICENSE'));
    }

    // Copy docs to dist
    const docsSrc = join(root, 'docs');
    const docsDist = join(dist, 'docs');
    if (existsSync(docsSrc)) {
      cpSync(docsSrc, docsDist, { recursive: true });
    }
  },
});
