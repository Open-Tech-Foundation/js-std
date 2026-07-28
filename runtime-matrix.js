/**
 * Runtime compatibility matrix.
 *
 * Runs the bundled `@opentf/std` test suite on JS runtimes and records how each
 * one did. Every runtime executes the *same* prebuilt bundle, so differences in
 * the numbers are differences in the runtime, never in the build.
 *
 * Three modes:
 *
 *   tsr matrix                     (builds the bundle, then sweeps)
 *   node runtime-matrix.js         (sweep only, bundle must already exist)
 *       Local sweep. Runs every engine found on PATH. Handy for a quick check,
 *       but it cannot cover multiple Node majors — CI is the source of truth.
 *
 *   node runtime-matrix.js --engine node --id node20 --label "Node.js 20" \
 *       --out results/node20.json
 *       Single runtime, for one CI matrix job.
 *
 *   node runtime-matrix.js --aggregate results/
 *       Merges per-runtime results into `runtime-matrix.json` and splices the
 *       docs page. Rewrites nothing when the numbers are unchanged, so CI only
 *       raises a PR on real drift.
 *
 * Adding a runtime: one entry in ENGINES, one id in ORDER, one CI matrix entry.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = import.meta.dirname;
const STD = path.join(ROOT, 'packages', 'std');
const REPORT = path.join(ROOT, 'runtime-matrix.json');
const DOC = path.join(
  ROOT,
  'website',
  'app',
  'docs',
  'env-support',
  'page.mdx',
);

const BUNDLE =
  process.env.MATRIX_BUNDLE ??
  path.join(STD, '.test-bundle', 'test-bundle.mjs');
const PROBE =
  process.env.MATRIX_PROBE ?? path.join(STD, 'scripts', 'runtime-probe.mjs');

const ENGINES = {
  node: { label: 'Node.js', bin: 'node', args: (f) => [f] },
  bun: { label: 'Bun', bin: 'bun', args: (f) => [f] },
  deno: { label: 'Deno', bin: 'deno', args: (f) => ['run', '-A', f] },
  esrun: { label: 'ES-Runtime', bin: 'esrun', args: (f) => [f] },
  llrt: { label: 'LLRT', bin: 'llrt', args: (f) => [f] },
  qjs: { label: 'QuickJS', bin: 'qjs', args: (f) => [f] },
};

/** Display order in the published table. Unlisted ids sort last, alphabetically. */
const ORDER = [
  'node20',
  'node22',
  'node24',
  'node',
  'bun',
  'deno',
  'esrun',
  'llrt',
  'qjs',
];

/**
 * Failures we have already diagnosed. Anything unmatched is reported as
 * `unknown`, and the aggregate step refuses to publish it — an unexplained
 * failure must stay visible rather than blending into a count.
 */
const KNOWN_ISSUES = [
  {
    match: /isBlob/,
    requires: 'Blob.toStringTag',
    affects: ['isBlob'],
    category: 'runtime-deviation',
    reason:
      'Runtime `Blob` is missing `Symbol.toStringTag`, so `Object.prototype.toString.call(blob)` ' +
      'returns `[object Object]`. This deviates from the File API spec; the fix belongs in the runtime.',
  },
  {
    match: /stringWidth|stringReverse|truncate/,
    requires: 'Intl.Segmenter',
    affects: ['stringWidth', 'stringReverse'],
    category: 'missing-capability',
    reason:
      'Grapheme segmentation needs `Intl.Segmenter`. Runtimes built without full ICU cannot ' +
      'count or reverse multi-codepoint characters correctly.',
  },
  {
    match: /formatCompact|formatCurrency|formatNumber/,
    requires: 'Intl.NumberFormat',
    affects: ['formatCompact', 'formatCurrency'],
    category: 'missing-capability',
    reason:
      'Number formatting needs `Intl.NumberFormat`. Runtimes built without ICU cannot format ' +
      'compact notation or currencies.',
  },
  {
    match: /uuid|randomInt|randomBytes|randomFloat|hash|hmac/i,
    requires: 'crypto.getRandomValues',
    affects: ['uuidv4', 'uuidv7', 'randomInt', 'randomBytes', 'randomFloat'],
    category: 'missing-capability',
    reason: 'Requires the Web Crypto API via `globalThis.crypto`.',
  },
  {
    match: /fromIterAsync/,
    requires: null,
    affects: ['fromIterAsync'],
    category: 'runtime-deviation',
    reason:
      'Runtime does not perform `IteratorClose` when a `for await...of` loop exits early, so a ' +
      '`finally` block in an async generator never runs. Required by ECMA-262; the equivalent ' +
      'sync `for...of` path is handled correctly. The fix belongs in the runtime.',
  },
];

const CATEGORY_LABEL = {
  'missing-capability': 'Missing platform API',
  'runtime-deviation': 'Runtime spec deviation',
  unknown: 'Undiagnosed',
};

// ---------------------------------------------------------------- helpers

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    } else {
      out._.push(a);
    }
  }
  return out;
}

/** Runtimes print version banners in wildly different shapes; keep just the number. */
const normalizeVersion = (raw) =>
  raw.match(/\d+\.\d+\.\d+[\w.-]*/)?.[0] ?? raw.trim();

function exec(bin, args, timeoutMs) {
  try {
    return {
      ok: true,
      stdout: execFileSync(bin, args, {
        encoding: 'utf-8',
        timeout: timeoutMs,
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    };
  } catch (err) {
    return {
      ok: false,
      stdout: `${err.stdout ?? ''}${err.stderr ?? ''}`,
      error: err.message,
    };
  }
}

function detectVersion(engine) {
  const res = exec(engine.bin, ['--version'], 15_000);
  return res.ok ? normalizeVersion(res.stdout.split('\n')[0]) : null;
}

function extract(marker, output) {
  const line = output.split('\n').find((l) => l.includes(marker));
  if (!line) return null;
  try {
    return JSON.parse(line.slice(line.indexOf(marker) + marker.length));
  } catch {
    return null;
  }
}

function classify(failure, caps) {
  for (const issue of KNOWN_ISSUES) {
    if (!issue.match.test(failure.title)) continue;
    // Only blame a capability gap when the capability is genuinely absent.
    if (issue.requires && caps && caps[issue.requires] === true) continue;
    return {
      category: issue.category,
      reason: issue.reason,
      requires: issue.requires,
      affects: issue.affects ?? [],
    };
  }
  return {
    category: 'unknown',
    reason: 'Not yet diagnosed.',
    requires: null,
    affects: [],
  };
}

/** Runs one engine and returns its result record. */
function measure(id, engine, label) {
  const version = detectVersion(engine);
  if (!version) return { id, label, status: 'not-measured' };

  const caps = extract(
    '__PROBE_JSON__',
    exec(engine.bin, engine.args(PROBE), 60_000).stdout,
  );
  const out = exec(engine.bin, engine.args(BUNDLE), 300_000);
  const results = extract('__RESULTS_JSON__', out.stdout);

  if (!results) {
    return {
      id,
      label,
      version,
      status: 'error',
      capabilities: caps,
      error: (out.stdout || out.error || '')
        .trim()
        .split('\n')
        .slice(-8)
        .join('\n'),
    };
  }

  return {
    id,
    label,
    version,
    status: results.failed === 0 ? 'pass' : 'partial',
    passed: results.passed,
    failed: results.failed,
    total: results.total,
    percent: Number(((results.passed / results.total) * 100).toFixed(1)),
    capabilities: caps,
    failures: results.failures.map((f) => ({
      title: f.title,
      message: f.message,
      ...classify(f, caps),
    })),
  };
}

/**
 * `JSON.stringify` always expands arrays, which Biome's formatter rejects — it
 * inlines short ones. Rather than replicate those rules, defer to Biome itself
 * so the committed file is canonical and a drift PR never fails formatting.
 */
function formatWithBiome(file) {
  const bin = path.join(ROOT, 'node_modules', '.bin', 'biome');
  if (!fs.existsSync(bin)) {
    throw new Error(
      `Cannot format ${path.relative(ROOT, file)}: ${bin} not found. Run \`bun install\` first.`,
    );
  }
  execFileSync(bin, ['format', '--write', file], {
    stdio: 'ignore',
    timeout: 60_000,
  });
}

function requireBundle() {
  if (fs.existsSync(BUNDLE)) return;
  throw new Error(
    `Missing ${BUNDLE}.\nBuild it first:\n  tsr build\n  tsr matrix:bundle`,
  );
}

const summarize = (r) =>
  r.status === 'not-measured'
    ? `${r.label.padEnd(14)} not installed, skipping`
    : r.status === 'error'
      ? `${r.label.padEnd(14)} ${r.version} — could not run suite`
      : `${r.label.padEnd(14)} ${String(r.version).padEnd(12)} ${r.passed}/${r.total} (${r.percent}%)${r.failed ? `  ${r.failed} failed` : ''}`;

// ---------------------------------------------------------------- rendering

function renderSection(report) {
  const measured = report.runtimes.filter((r) => r.status !== 'not-measured');
  const total = measured.find((r) => r.total)?.total ?? 0;

  const lines = [
    `_Measured on ${report.generatedAt} against \`${report.package}@${report.version}\`, ` +
      `running the full suite of ${total} tests on each runtime._`,
    '',
    '| Runtime | Version | Tests passing | Status |',
    '| --- | --- | --- | --- |',
  ];

  for (const r of measured) {
    const icon =
      r.status === 'pass' ? '✅' : r.status === 'partial' ? '⚠️' : '❌';
    const status =
      r.status === 'pass'
        ? 'Fully supported'
        : r.status === 'partial'
          ? 'Partial'
          : 'Failed to run';
    const score = r.total ? `${r.passed} / ${r.total} (${r.percent}%)` : '—';
    lines.push(
      `| ${r.label} | \`${r.version}\` | ${score} | ${icon} ${status} |`,
    );
  }

  for (const r of measured) {
    if (!r.failures?.length) continue;

    // One entry per distinct cause, not per failing assertion.
    const byCause = new Map();
    for (const f of r.failures) {
      const key = `${f.category}|${f.requires}|${f.reason}`;
      if (!byCause.has(key))
        byCause.set(key, { ...f, count: 0, affects: new Set(f.affects) });
      const e = byCause.get(key);
      e.count++;
      for (const a of f.affects) e.affects.add(a);
    }

    lines.push('', `### ${r.label} ${r.version}`, '');
    for (const c of byCause.values()) {
      const affected = [...c.affects].map((a) => `\`${a}\``).join(', ');
      lines.push(
        `**${CATEGORY_LABEL[c.category]}${c.requires ? ` — \`${c.requires}\` unavailable` : ''}** ` +
          `(${c.count} test${c.count === 1 ? '' : 's'})`,
        '',
        c.reason,
        '',
        affected
          ? `Affected utilities: ${affected}. Everything else works as expected.`
          : '',
        '',
      );
    }
  }

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const START = '{/* MATRIX:START */}';
const END = '{/* MATRIX:END */}';

function spliceDoc(report) {
  if (!fs.existsSync(DOC)) return false;
  const doc = fs.readFileSync(DOC, 'utf-8');
  if (!doc.includes(START) || !doc.includes(END)) {
    throw new Error(
      `${path.relative(ROOT, DOC)} is missing the ${START} / ${END} markers.`,
    );
  }
  const next = `${doc.slice(0, doc.indexOf(START) + START.length)}\n\n${renderSection(report)}\n\n${doc.slice(doc.indexOf(END))}`;
  if (next === doc) return false;
  fs.writeFileSync(DOC, next);
  return true;
}

/**
 * The comparable shape of a report: everything except timestamps and timings.
 * Durations vary run to run and would otherwise raise a PR on every schedule.
 */
const comparable = (report) =>
  JSON.stringify(
    report.runtimes.map((r) => ({
      id: r.id,
      version: r.version,
      status: r.status,
      passed: r.passed,
      failed: r.failed,
      total: r.total,
      capabilities: r.capabilities,
      failures: (r.failures ?? []).map((f) => ({
        title: f.title,
        category: f.category,
        requires: f.requires,
      })),
    })),
  );

// ---------------------------------------------------------------- modes

const args = parseArgs(process.argv.slice(2));
const stdPkg = JSON.parse(
  fs.readFileSync(path.join(STD, 'package.json'), 'utf-8'),
);

if (args.aggregate) {
  const dir =
    args.aggregate === true ? path.join(ROOT, 'results') : args.aggregate;
  const files = fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === 'string' && f.endsWith('.json'))
    .map((f) => path.join(dir, f));

  if (files.length === 0)
    throw new Error(`No result JSON files found under ${dir}`);

  const runtimes = files.map((f) => JSON.parse(fs.readFileSync(f, 'utf-8')));
  runtimes.sort((a, b) => {
    const ia = ORDER.indexOf(a.id);
    const ib = ORDER.indexOf(b.id);
    return (
      (ia === -1 ? Number.POSITIVE_INFINITY : ia) -
        (ib === -1 ? Number.POSITIVE_INFINITY : ib) || a.id.localeCompare(b.id)
    );
  });

  const undiagnosed = runtimes.flatMap((r) =>
    (r.failures ?? [])
      .filter((f) => f.category === 'unknown')
      .map((f) => `${r.label}: ${f.title} — ${f.message}`),
  );

  const previous = fs.existsSync(REPORT)
    ? JSON.parse(fs.readFileSync(REPORT, 'utf-8'))
    : null;
  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    package: stdPkg.name,
    version: stdPkg.version,
    runtimes,
  };

  for (const r of runtimes) console.log(`- ${summarize(r)}`);

  if (undiagnosed.length) {
    console.log(
      `\n::error::${undiagnosed.length} undiagnosed failure(s) — add a KNOWN_ISSUES entry in runtime-matrix.js`,
    );
    for (const u of undiagnosed) console.log(`   ${u}`);
    throw new Error(
      `${undiagnosed.length} undiagnosed failure(s); refusing to publish.`,
    );
  }

  const drifted =
    !previous ||
    comparable(previous) !== comparable(report) ||
    previous.version !== report.version;

  /** Human-readable drift lines, shared by the log, the job summary and the PR comment. */
  const driftLines = [];
  if (drifted && previous) {
    for (const r of report.runtimes) {
      const before = previous.runtimes.find((p) => p.id === r.id);
      if (!before) {
        driftLines.push(
          `- **${r.label}** \`${r.version}\` — ${r.passed}/${r.total} (newly measured)`,
        );
      } else if (before.passed !== r.passed) {
        const arrow = r.passed > before.passed ? '📈' : '📉';
        driftLines.push(
          `- ${arrow} **${r.label}** — ${before.passed}/${before.total} → **${r.passed}/${r.total}**${before.version !== r.version ? ` (runtime \`${before.version}\` → \`${r.version}\`)` : ''}`,
        );
      } else if (before.version !== r.version) {
        driftLines.push(
          `- **${r.label}** — runtime \`${before.version}\` → \`${r.version}\`, same ${r.passed}/${r.total}`,
        );
      }
    }
    for (const p of previous.runtimes) {
      if (!report.runtimes.some((r) => r.id === p.id))
        driftLines.push(`- **${p.label}** — no longer measured`);
    }
  }

  if (args.check) {
    // PR mode: report what the numbers are, change nothing. Contributors never
    // hand-generate results that only CI can produce.
    console.log(
      drifted
        ? '\nNumbers differ from the committed runtime-matrix.json:'
        : '\nNo drift from the committed runtime-matrix.json.',
    );
    for (const l of driftLines) console.log(`  ${l.replace(/\*\*/g, '')}`);
    if (drifted)
      console.log(
        '\nInformational — the matrix is refreshed automatically after merge.',
      );
  } else if (!drifted) {
    console.log('\nNo drift — runtime-matrix.json left untouched.');
  } else {
    fs.writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`);
    formatWithBiome(REPORT);
    spliceDoc(report);
    console.log(
      '\nNumbers drifted — updated runtime-matrix.json and the docs page.',
    );
  }

  const markdown = `## Runtime compatibility\n\n${renderSection(report)}\n${driftLines.length ? `\n### Changes vs committed matrix\n\n${driftLines.join('\n')}\n` : ''}`;

  // Consumed by the workflow to decide whether to open a PR.
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `drifted=${drifted}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  }
  // Posted as a sticky PR comment so reviewers see the numbers without leaving the PR.
  if (process.env.MATRIX_COMMENT_FILE) {
    fs.writeFileSync(process.env.MATRIX_COMMENT_FILE, markdown);
  }
} else if (args.engine) {
  const engine = ENGINES[args.engine];
  if (!engine)
    throw new Error(
      `Unknown engine "${args.engine}". Known: ${Object.keys(ENGINES).join(', ')}`,
    );

  requireBundle();
  const id = args.id ?? args.engine;
  const result = measure(id, engine, args.label ?? engine.label);
  console.log(`- ${summarize(result)}`);
  for (const f of result.failures ?? [])
    console.log(`    ${f.category}: ${f.title}`);

  const out = args.out ?? path.join(ROOT, 'results', `${id}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`  -> ${path.relative(ROOT, out)}`);

  if (result.status === 'not-measured') {
    throw new Error(`${engine.bin} is not installed in this job.`);
  }
} else {
  // Local sweep. Cannot cover multiple Node majors; CI is authoritative.
  requireBundle();
  console.log(
    `Running @opentf/std ${stdPkg.version} test suite across local runtimes...\n`,
  );

  const runtimes = [];
  for (const [id, engine] of Object.entries(ENGINES)) {
    const result = measure(id, engine, engine.label);
    console.log(`- ${summarize(result)}`);
    runtimes.push(result);
  }

  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    package: stdPkg.name,
    version: stdPkg.version,
    runtimes,
  };
  console.log(`\n${renderSection(report)}`);
  console.log(
    '\nLocal run only — not written to disk. CI covers every Node major and is the\n' +
      'source of truth for runtime-matrix.json. Use --aggregate to publish.',
  );
}
