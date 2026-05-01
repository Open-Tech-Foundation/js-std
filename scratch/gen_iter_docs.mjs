import fs from 'node:fs';
import path from 'node:path';

const methods = [
  {
    name: 'mapIterAsync',
    desc: 'Transforms each item using an async/sync mapper function.',
    example: 'mapIterAsync(asyncGen([1, 2]), x => x * 2)',
  },
  {
    name: 'filterIterAsync',
    desc: 'Filters items based on an async/sync predicate.',
    example: 'filterIterAsync(asyncGen([1, 2, 3]), x => x % 2 === 0)',
  },
  {
    name: 'flatMapIterAsync',
    desc: 'Maps each item and flattens the resulting async/sync iterators.',
    example: 'flatMapIterAsync(asyncGen([1, 2]), x => [x, x * 10])',
  },
  {
    name: 'reduceIterAsync',
    desc: 'Accumulates values from the async iterator.',
    example: 'reduceIterAsync(asyncGen([1, 2, 3]), (acc, x) => acc + x, 0)',
  },
  {
    name: 'toArrayIterAsync',
    desc: 'Collects all items into an array.',
    example: 'toArrayIterAsync(asyncGen([1, 2, 3]))',
  },
  {
    name: 'forEachIterAsync',
    desc: 'Executes a function for each item in the async iterator.',
    example: 'forEachIterAsync(asyncGen([1, 2]), x => console.log(x))',
  },
  {
    name: 'someIterAsync',
    desc: 'Returns true if any item matches the predicate.',
    example: 'someIterAsync(asyncGen([1, 2, 3]), x => x > 2)',
  },
  {
    name: 'everyIterAsync',
    desc: 'Returns true if all items match the predicate.',
    example: 'everyIterAsync(asyncGen([1, 2, 3]), x => x > 0)',
  },
  {
    name: 'findIterAsync',
    desc: 'Returns the first item that matches the predicate.',
    example: 'findIterAsync(asyncGen([1, 2, 3]), x => x > 1)',
  },
  {
    name: 'takeIterAsync',
    desc: 'Yields the first n items from an async iterable.',
    example: 'takeIterAsync(asyncGen([1, 2, 3]), 2)',
  },
  {
    name: 'dropIterAsync',
    desc: 'Skips the first n items from an async iterable.',
    example: 'dropIterAsync(asyncGen([1, 2, 3]), 1)',
  },
  {
    name: 'fromIterAsync',
    desc: 'Creates an async iterator from various sources.',
    example: 'fromIterAsync([1, 2, 3])',
  },
  {
    name: 'toAsyncIter',
    desc: 'Converts a sync iterable to an async iterable.',
    example: 'toAsyncIter([1, 2, 3])',
  },
  {
    name: 'takeWhileIterAsync',
    desc: 'Yields items as long as the predicate is true.',
    example: 'takeWhileIterAsync(asyncGen([1, 2, 3]), x => x < 3)',
  },
  {
    name: 'dropWhileIterAsync',
    desc: 'Skips items as long as the predicate is true.',
    example: 'dropWhileIterAsync(asyncGen([1, 2, 3]), x => x < 2)',
  },
  {
    name: 'nthIterAsync',
    desc: 'Returns the nth item from an async iterable.',
    example: 'nthIterAsync(asyncGen([1, 2, 3]), 1)',
  },
  {
    name: 'firstIterAsync',
    desc: 'Returns the first item from an async iterable.',
    example: 'firstIterAsync(asyncGen([1, 2, 3]))',
  },
  {
    name: 'lastIterAsync',
    desc: 'Returns the last item from an async iterable.',
    example: 'lastIterAsync(asyncGen([1, 2, 3]))',
  },
  {
    name: 'countIterAsync',
    desc: 'Returns the total count of items in an async iterable.',
    example: 'countIterAsync(asyncGen([1, 2, 3]))',
  },
  {
    name: 'findLastIterAsync',
    desc: 'Returns the last item that matches the predicate.',
    example: 'findLastIterAsync(asyncGen([1, 2, 3, 2]), x => x === 2)',
  },
  {
    name: 'findIndexIterAsync',
    desc: 'Returns the index of the first item that matches the predicate.',
    example: 'findIndexIterAsync(asyncGen([1, 2, 3]), x => x === 2)',
  },
  {
    name: 'findLastIndexIterAsync',
    desc: 'Returns the index of the last item that matches the predicate.',
    example: 'findLastIndexIterAsync(asyncGen([1, 2, 3, 2]), x => x === 2)',
  },
];

const mdxDir = 'apps/docs/pages/Iter';
const mdDir = 'packages/std/docs/Iter';

methods.forEach((m) => {
  const content = `import { Callout } from 'nextra/components'

# ${m.name}

${m.desc}

## Usage

\`\`\`js
import { ${m.name} } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await ${m.example};
// ...
\`\`\`
`;
  fs.writeFileSync(path.join(mdxDir, `${m.name}.mdx`), content);

  const mdContent = `# ${m.name}

${m.desc}

## Usage

\`\`\`js
import { ${m.name} } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await ${m.example};
// ...
\`\`\`
`;
  fs.writeFileSync(path.join(mdDir, `${m.name}.md`), mdContent);
});

console.log('Docs generated!');
