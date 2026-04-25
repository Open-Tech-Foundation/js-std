import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'src';
const docsDir = 'docs';
const readmePath = 'README.md';

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const categories = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());

const indexData = {};

categories.forEach(cat => {
  const catDir = path.join(srcDir, cat);
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.ts'));
  const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
  indexData[catName] = [];

  files.forEach(file => {
    const filePath = path.join(catDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract JSDoc
    const jsDocMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
    if (!jsDocMatch) return;

    let jsDoc = jsDocMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim())
      .join('\n')
      .trim();

    // Format @example
    jsDoc = jsDoc.replace(/@example\n?/g, '### Example\n\n```js\n');
    if (jsDoc.includes('### Example')) {
      jsDoc += '\n```';
    }

    // Extract function name
    const funcMatch = content.match(/export default function\s+(\w+)/);
    const name = funcMatch ? funcMatch[1] : path.basename(file, '.ts');

    const mdContent = `# ${name}\n\n${jsDoc}\n`;

    const outDir = path.join(docsDir, catName);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(path.join(outDir, `${name}.md`), mdContent);
    indexData[catName].push(name);
  });
});

// Generate docs/README.md
let indexContent = '# Documentation\n\n';
Object.keys(indexData).sort().forEach(cat => {
  indexContent += `## ${cat}\n\n`;
  indexData[cat].sort().forEach(name => {
    indexContent += `- [${name}](./${cat}/${name}.md)\n`;
  });
  indexContent += '\n';
});

fs.writeFileSync(path.join(docsDir, 'README.md'), indexContent);

// Update main README.md
let readme = fs.readFileSync(readmePath, 'utf8');

Object.keys(indexData).sort().forEach(cat => {
  // Matches H2 or H3 headers
  const regex = new RegExp(`([#]{2,3} ${cat}[\\s\\S]*?)([#]{2,3}|##|$)`, 'g');
  readme = readme.replace(regex, (match, p1, p2) => {
    const header = p1.split('\n')[0]; // Keep original header level
    let newList = `${header}\n\n`;
    indexData[cat].sort().forEach(name => {
      newList += `- [${name}](./docs/${cat}/${name}.md)\n`;
    });
    return newList + '\n' + p2;
  });
});

fs.writeFileSync(readmePath, readme);

console.log('Docs generated and README updated successfully.');
