/**
 * Generates `docs/` from the JSDoc on each exported function.
 *
 * The repository documentation was hand-copied from those comments, which is
 * why it had drifted from them and why 221 of its files showed readers a raw
 * `@param {T[]} arr` — a tag pasted into markdown, where nothing renders it.
 * The comment is the thing that lives next to the code and gets updated with
 * it, so it is the source and this is the copy.
 *
 * A page carrying the `<!-- handwritten -->` marker is left alone. Some pages
 * say more than one function's comment can — the `DateTime`, `Duration` and
 * `Decimal` classes document many methods on one page — and a generator that
 * overwrote those would be trading a formatting bug for a content loss.
 *
 * Run with `bun run docs` from `packages/std`.
 */
import fs from 'node:fs';
import path from 'node:path';

const here = import.meta.dirname;
const stdDir = path.resolve(here, '..');
const srcDir = path.join(stdDir, 'src');
const docsDir = path.join(stdDir, 'docs');

const MARKER = '<!-- handwritten -->';

/** Every `export { default as name } from './path'`, including multi-name forms. */
function readExports() {
  const index = fs.readFileSync(path.join(srcDir, 'index.ts'), 'utf8');
  const re = /export\s*\{\s*default as (\w+)[^}]*\}\s*from\s*'\.\/([\w/]+)'/g;
  const out = new Map();
  for (const m of index.matchAll(re)) out.set(m[1], m[2]);
  return out;
}

/**
 * The doc block attached to the default export.
 *
 * Taking the first block in the file would pick up whatever a module happens
 * to define ahead of its function — `deepFreeze.ts` opens with the JSDoc for
 * the `DeepReadonly` type, which describes something else entirely.
 */
function readJsDoc(modulePath) {
  const file = path.join(srcDir, `${modulePath}.ts`);
  if (!fs.existsSync(file)) return null;

  const text = fs.readFileSync(file, 'utf8');
  const attached =
    /\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\s*export\s+default\s/.exec(text);
  const blocks = [...text.matchAll(/\/\*\*((?:(?!\*\/)[\s\S])*?)\*\//g)];
  const body = attached ? attached[1] : blocks.at(-1)?.[1];
  if (body === undefined) return null;

  return body
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim();
}

/**
 * Reads a leading `{type}`, counting braces.
 *
 * A type is not brace-free — `@param {{ pad?: boolean }} [options]` describes
 * an object literal — so stopping at the first `}` would cut it in half.
 */
function takeType(text) {
  if (!text.startsWith('{')) return [null, text];

  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) {
      return [text.slice(1, i).trim(), text.slice(i + 1).trim()];
    }
  }
  return [null, text];
}

/**
 * Splits a doc block into its description and its tags, in order.
 *
 * A tag's text can wrap across lines, so a line following one continues it
 * rather than starting something new. A line after a blank one is a paragraph
 * that was written below the tags instead of above them; it is kept as part of
 * the description and reported, since dropping prose silently is how a
 * generator quietly loses documentation.
 */
function parseJsDoc(doc) {
  const description = [];
  const params = [];
  const examples = [];
  const orphans = [];
  const throws = [];
  let returns = null;
  let example = null;
  let continues = null;
  let sawTag = false;
  let blank = false;

  for (const line of doc.split('\n')) {
    const tag = /^@(\w+)\s*(.*)$/.exec(line);

    if (tag) {
      const [, name, rest] = tag;
      sawTag = true;
      blank = false;
      example = null;
      continues = null;

      if (name === 'param') {
        const [type, after] = takeType(rest);
        // `[size=1]` carries the default with the name; keep both apart.
        const m = /^(\[?)([\w.$]+)(?:=([^\]]*))?(\]?)\s*-?\s*(.*)$/.exec(after);
        const param = m
          ? {
              type,
              name: m[2],
              optional: m[1] === '[' && m[4] === ']',
              default: m[3] ?? null,
              text: m[5],
            }
          : { type, name: null, text: after };
        params.push(param);
        continues = param;
      } else if (name === 'returns' || name === 'return') {
        const [type, after] = takeType(rest);
        returns = { type, text: after.replace(/^-\s*/, '') };
        continues = returns;
      } else if (name === 'throws') {
        const [type, after] = takeType(rest);
        const entry = { type, text: after.replace(/^-\s*/, '') };
        throws.push(entry);
        continues = entry;
      } else if (name === 'example') {
        example = rest.trim() ? [rest] : [];
        examples.push(example);
      }
      continue;
    }

    if (!line.trim()) {
      blank = true;
      continues = null;
      if (example) example.push(line);
      else if (!sawTag) description.push(line);
      continue;
    }

    if (example) example.push(line);
    else if (continues && !blank) continues.text = `${continues.text} ${line.trim()}`.trim();
    else if (sawTag) orphans.push(line);
    else description.push(line);
    blank = false;
  }

  if (orphans.length > 0) description.push('', ...orphans);

  return {
    description: description.join('\n').trim(),
    params,
    returns,
    throws,
    orphans,
    examples: examples
      .map((lines) => lines.join('\n').replace(/^\n+|\n+$/g, ''))
      .filter(Boolean),
  };
}

function renderParam({ type, name, text, optional, default: def }) {
  if (!name) return `- ${text}`;
  // `options.pad` documents a property of `options`, so nest it under it.
  const indent = name.includes('.') ? '  ' : '';
  const parts = [`${indent}- **${name}**`];
  if (type) parts.push(` \`${type}\``);
  if (def !== null && def !== undefined) parts.push(` _(default: \`${def}\`)_`);
  else if (optional) parts.push(' _(optional)_');
  if (text) parts.push(` — ${text}`);
  return parts.join('');
}

function render(name, doc, report) {
  const { description, params, returns, throws, examples, orphans } =
    parseJsDoc(doc);
  if (orphans.length > 0) report.push(name);
  const out = [`# ${name}`, ''];

  if (description) out.push(description, '');

  if (params.length > 0) {
    out.push('## Parameters', '');
    for (const p of params) out.push(renderParam(p));
    out.push('');
  }

  if (returns) {
    out.push('## Returns', '');
    const type = returns.type ? `\`${returns.type}\`` : '';
    out.push([type, returns.text].filter(Boolean).join(' — '), '');
  }

  if (throws.length > 0) {
    out.push('## Throws', '');
    for (const t of throws) {
      const type = t.type ? `\`${t.type}\`` : '';
      out.push(`- ${[type, t.text].filter(Boolean).join(' — ')}`);
    }
    out.push('');
  }

  if (examples.length > 0) {
    out.push(examples.length > 1 ? '## Examples' : '## Example', '');
    for (const ex of examples) out.push('```js', ex, '```', '');
  }

  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
}

/** Where a page already lives, so generating does not move it. */
function readLayout() {
  const layout = new Map();
  for (const category of fs.readdirSync(docsDir)) {
    const dir = path.join(docsDir, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.md')) layout.set(file.slice(0, -3), category);
    }
  }
  return layout;
}

function renderIndex(layout, names) {
  const byCategory = new Map();
  for (const name of names) {
    const category = layout.get(name);
    if (!category) continue;
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(name);
  }

  const out = ['# Documentation', ''];
  for (const category of [...byCategory.keys()].sort()) {
    out.push(`## ${category}`, '');
    for (const name of byCategory.get(category).sort()) {
      out.push(`- [${name}](./${category}/${name}.md)`);
    }
    out.push('');
  }
  return `${out.join('\n').trimEnd()}\n`;
}

const exports_ = readExports();
const layout = readLayout();
const stats = { written: 0, unchanged: 0, skipped: 0, missing: [] };
const misplaced = [];

for (const [name, modulePath] of exports_) {
  const category = layout.get(name);
  if (!category) {
    stats.missing.push(name);
    continue;
  }

  const file = path.join(docsDir, category, `${name}.md`);
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8').includes(MARKER)) {
    stats.skipped++;
    continue;
  }

  const doc = readJsDoc(modulePath);
  if (!doc) {
    stats.missing.push(name);
    continue;
  }

  const next = render(name, doc, misplaced);
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === next) {
    stats.unchanged++;
    continue;
  }

  fs.writeFileSync(file, next);
  stats.written++;
}

const indexFile = path.join(docsDir, 'README.md');
const index = renderIndex(layout, [...exports_.keys()]);
if (fs.readFileSync(indexFile, 'utf8') !== index) {
  fs.writeFileSync(indexFile, index);
  stats.written++;
}

console.log(
  `docs: ${stats.written} written, ${stats.unchanged} unchanged, ` +
    `${stats.skipped} handwritten`,
);
if (stats.missing.length > 0) {
  console.log(`no page or no jsdoc: ${stats.missing.join(', ')}`);
}
if (misplaced.length > 0) {
  console.log(
    `prose written below the tags, move it above @param: ${misplaced.join(', ')}`,
  );
}
