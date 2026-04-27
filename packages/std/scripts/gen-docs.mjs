import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'src';
const docsDir = 'docs';
const readmePath = '../../README.md';

if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.mkdirSync(docsDir, { recursive: true });

function parseJSDoc(content) {
  const jsDocMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
  if (!jsDocMatch) return null;

  const lines = jsDocMatch[1].split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim());
  
  const result = {
    description: '',
    params: [],
    returns: null,
    examples: []
  };

  let currentTag = 'description';
  let exampleLines = [];

  for (const line of lines) {
    if (line.startsWith('@param')) {
      const match = line.match(/@param\s+\{(.+)\}\s+(\w+)\s+(.+)/);
      if (match) {
        result.params.push({ type: match[1], name: match[2], description: match[3] });
      }
      currentTag = 'param';
    } else if (line.startsWith('@returns')) {
      const match = line.match(/@returns\s+\{(.+)\}\s+(.+)/);
      if (match) {
        result.returns = { type: match[1], description: match[2] };
      }
      currentTag = 'returns';
    } else if (line.startsWith('@example')) {
      currentTag = 'example';
    } else if (currentTag === 'example') {
      exampleLines.push(line);
    } else if (currentTag === 'description') {
      if (line) result.description += (result.description ? '\n' : '') + line;
    }
  }

  if (exampleLines.length > 0) {
    result.examples = exampleLines.join('\n').trim();
  }

  return result;
}

function extractSignature(content, name) {
  const lines = content.split('\n');
  const funcIndex = lines.findIndex(l => l.includes(`export default function ${name}`));
  if (funcIndex === -1) return name;
  
  let signature = '';
  for (let i = funcIndex; i < lines.length; i++) {
    signature += lines[i].trim() + ' ';
    if (lines[i].includes('{')) break;
  }
  return signature.replace(/export default function /, '').replace(/ \{.*$/, '').trim();
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

    // Extract function name
    const funcMatch = content.match(/export default function\s+(\w+)/);
    const name = funcMatch ? funcMatch[1] : path.basename(file, '.ts');

    const jsDoc = parseJSDoc(content);
    if (!jsDoc) return;

    const signature = extractSignature(content, name);

    let mdContent = `# ${name}\n\n`;
    mdContent += `${jsDoc.description}\n\n`;
    
    mdContent += `## Syntax\n\n`;
    mdContent += `\`\`\`ts\nimport { ${name} } from '@opentf/std';\n\n${signature}\n\`\`\`\n\n`;

    if (jsDoc.params.length > 0) {
      mdContent += `## Parameters\n\n`;
      mdContent += `| Name | Type | Description |\n`;
      mdContent += `| --- | --- | --- |\n`;
      jsDoc.params.forEach(p => {
        mdContent += `| ${p.name} | \`${p.type}\` | ${p.description} |\n`;
      });
      mdContent += `\n`;
    }

    if (jsDoc.returns) {
      mdContent += `## Returns\n\n`;
      mdContent += `\`${jsDoc.returns.type}\`: ${jsDoc.returns.description}\n\n`;
    }

    if (jsDoc.examples) {
      mdContent += `## Example\n\n`;
      mdContent += `\`\`\`js\n${jsDoc.examples}\n\`\`\`\n`;
    }

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
