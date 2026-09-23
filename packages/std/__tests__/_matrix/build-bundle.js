/**
 * Bundles the whole spec suite into a single runtime-agnostic ESM file.
 *
 * The bundle deliberately targets `dist/index.js` rather than `src`, so the
 * matrix measures the artifact users actually install — that also catches
 * minification, tree-shaking and export-map regressions.
 *
 * Output goes to `bundle/` beside this script rather than `dist/`, because
 * package.json ships
 * `files: ["dist"]` and a 700 KB test bundle must never reach npm.
 * Runnable by any ES2022 runtime with no module resolution, no `node:` builtins
 * and no test runner of its own.
 *
 * Run with `tsr matrix:bundle` from the workspace root.
 */
import { build } from 'runtime:build';
import { exists, file, readDir, remove, stat, write } from 'runtime:fs';
import {
  dirname,
  fromFileURL,
  join,
  relative,
  resolve,
  sep,
} from 'runtime:path';

const here = dirname(fromFileURL(import.meta.url));
const stdDir = resolve(here, '..', '..');
const testsDir = join(stdDir, '__tests__');
const outfile = join(here, 'bundle', 'test-bundle.mjs');
const distEntry = join(stdDir, 'dist', 'index.js');

if (!(await exists(distEntry))) {
  throw new Error(
    `Missing ${distEntry}. Run \`esdev build\` in packages/std first.`,
  );
}

async function findSpecs(dir, found = []) {
  for (const entry of await readDir(dir)) {
    const full = join(dir, entry.name);
    if (entry.isDir) {
      if (entry.name !== '_harness') await findSpecs(full, found);
    } else if (entry.name.endsWith('.spec.ts')) {
      found.push(full);
    }
  }
  return found;
}

const specs = (await findSpecs(testsDir)).sort();
if (specs.length === 0) throw new Error('No spec files found.');

const entryPath = join(stdDir, '.test-bundle-entry.ts');
const entrySource = `
import { run } from './__tests__/_harness/index';
${specs.map((f) => `import ${JSON.stringify(`./${relative(stdDir, f).split(sep).join('/')}`)};`).join('\n')}

const results = await run();
results.specFiles = ${specs.length};

// Machine-readable line the matrix runner parses; humans get the summary below.
console.log('__RESULTS_JSON__' + JSON.stringify(results));
console.log(
  \`\\n\${results.passed} passed, \${results.failed} failed, \${results.skipped} skipped \` +
  \`(\${results.total} tests across ${specs.length} files) in \${results.durationMs}ms\`
);
for (const f of results.failures) console.log(\`  FAIL \${f.title}\\n       \${f.message}\`);

// The only portable non-zero exit signal: esrun has neither \`process\` nor \`Deno\`.
if (results.failed > 0) throw new Error(\`\${results.failed} test(s) failed.\`);
`;

await write(entryPath, entrySource);

try {
  const bundle = await build({
    input: entryPath,
    platform: 'neutral',
    // package.json declares `sideEffects: false` for tree-shaking consumers, but
    // importing a spec file IS the side effect (it registers tests). Without this
    // the bundler drops all the imports and the bundle silently runs nothing.
    treeshake: false,
    resolve: {
      alias: {
        util: join(here, 'util-stub.js'),
        'runtime:test': join(testsDir, '_harness', 'index.ts'),
      },
    },
    plugins: [
      {
        name: 'src-to-dist',
        resolve: {
          filter: { id: /(^|\/)src$/ },
          handler(_source, _importer, ctx) {
            // Point every `../../src` barrel import at the built artifact.
            if (ctx.isEntry) return null;
            return { id: distEntry };
          },
        },
      },
    ],
  });
  try {
    const { output } = await bundle.generate({
      format: 'esm',
      codeSplitting: false,
    });
    const chunk = output.find((o) => o.isEntry) ?? output[0];
    await write(outfile, chunk.code);
  } finally {
    await bundle.close();
  }
} finally {
  await remove(entryPath);
}

const { size } = await stat(outfile);
const text = await file(outfile).text();
const leaked = [...text.matchAll(/["']node:[a-z_/]+["']/g)];
if (leaked.length > 0) {
  throw new Error(
    `Bundle references Node builtins: ${[...new Set(leaked.map((m) => m[0]))].join(', ')}`,
  );
}

console.log(
  `Bundled ${specs.length} spec files -> ${relative(stdDir, outfile)} ` +
    `(${(size / 1024).toFixed(0)} KB, no node: builtins)`,
);
