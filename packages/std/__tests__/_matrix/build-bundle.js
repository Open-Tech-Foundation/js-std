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
 */
import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';

const here = import.meta.dirname;
const stdDir = path.resolve(here, '..', '..');
const testsDir = path.join(stdDir, '__tests__');
const outfile = path.join(here, 'bundle', 'test-bundle.mjs');
const distEntry = path.join(stdDir, 'dist', 'index.js');

if (!fs.existsSync(distEntry)) {
  throw new Error(
    `Missing ${distEntry}. Run \`bun run build\` in packages/std first.`,
  );
}

function findSpecs(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_harness') findSpecs(full, found);
    } else if (entry.name.endsWith('.spec.ts')) {
      found.push(full);
    }
  }
  return found;
}

const specs = findSpecs(testsDir).sort();
if (specs.length === 0) throw new Error('No spec files found.');

const entryPath = path.join(stdDir, '.test-bundle-entry.ts');
const entrySource = `
import { run } from './__tests__/_harness/index';
${specs.map((f) => `import ${JSON.stringify(`./${path.relative(stdDir, f).split(path.sep).join('/')}`)};`).join('\n')}

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

fs.writeFileSync(entryPath, entrySource, 'utf-8');

try {
  await esbuild.build({
    entryPoints: [entryPath],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    // fake-timers is CJS, so `main` has to be considered explicitly under `neutral`.
    mainFields: ['module', 'main'],
    conditions: ['import', 'default'],
    // package.json declares `sideEffects: false` for tree-shaking consumers, but
    // importing a spec file IS the side effect (it registers tests). Without this
    // esbuild drops all 146 imports and the bundle silently runs nothing.
    ignoreAnnotations: true,
    alias: {
      util: path.join(here, 'util-stub.js'),
    },
    plugins: [
      {
        name: 'src-to-dist',
        setup(build) {
          // Point every `../../src` barrel import at the built artifact.
          build.onResolve({ filter: /(^|\/)src$/ }, (args) => {
            if (args.kind === 'entry-point') return null;
            return { path: distEntry };
          });
        },
      },
    ],
  });
} finally {
  fs.rmSync(entryPath, { force: true });
}

const { size } = fs.statSync(outfile);
const leaked = [
  ...fs.readFileSync(outfile, 'utf-8').matchAll(/["']node:[a-z_/]+["']/g),
];
if (leaked.length > 0) {
  throw new Error(
    `Bundle references Node builtins: ${[...new Set(leaked.map((m) => m[0]))].join(', ')}`,
  );
}

console.log(
  `Bundled ${specs.length} spec files -> ${path.relative(stdDir, outfile)} ` +
    `(${(size / 1024).toFixed(0)} KB, no node: builtins)`,
);
