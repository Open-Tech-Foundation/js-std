'use client';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import '@opentf/react-node-repl/lib/style.css';

const NodeREPL = dynamic(
  () => import('@opentf/react-node-repl').then((mod) => mod.NodeREPL),
  { ssr: false },
);

const code = `/**
 * @opentf/std Playground
 * 
 * Explore the library's high-fidelity utilities.
 */
const { 
  clone, 
  isEql, 
  withResolvers, 
  mapAsync, 
  pascalCase, 
  color,
  isNumber
} = require("@opentf/std");

// --- 1. Deep Everything ---
// Unlike native structuredClone, we support circular refs and modern types seamlessly.
const original = {
  name: "JS Std",
  meta: new Map([["version", "beta.3"]]),
  tags: new Set(["modern", "fast"]),
  created: new Date()
};
original.self = original; // Circular reference

const cloned = clone(original);
log("Cloned successfully:", cloned !== original && isEql(cloned, original));


// --- 2. Smart Equality ---
// Order matters in Maps/Sets, and we handle it with precision.
const mapA = new Map([["a", 1], ["b", 2]]);
const mapB = new Map([["b", 2], ["a", 1]]);
log("Map Eql (Strict Order):", isEql(mapA, mapB)); // false


// --- 3. Modern Async ---
// Clean up your async/await patterns.
async function demoAsync() {
  const { promise, resolve } = withResolvers();
  
  setTimeout(() => resolve("Async data fetched!"), 500);
  
  const data = await promise;
  log(data);

  // Run tasks with controlled concurrency (2 at a time)
  const results = await mapAsync([1, 2, 3], async (n) => {
    return n * 2;
  }, 2);
  log("Processed async:", results);
}

demoAsync();


// --- 4. Colors ---
// Powerful color manipulation in any environment.
const brandHex = color("royalblue", "hex");
const brandRGB = color("royalblue", "rgb");
log("RoyalBlue Hex:", brandHex);
log("RoyalBlue RGB:", brandRGB);


// --- 5. Robust Types ---
log("isNumber(NaN):", isNumber(NaN)); // false
log("isNumber('123', true):", isNumber('123', true)); // true
`;

const setupCode = `const _ = require('lodash');
const R = require('ramda');
const log = console.log;`;

export default function PlaygroundREPL() {
  const { resolvedTheme } = useTheme();

  return (
    <div style={{ padding: '25px' }}>
      <NodeREPL
        code={code}
        setupCode={setupCode}
        deps={['@opentf/std@1.0.0-beta.3', 'lodash', 'ramda']}
        layout="SPLIT_PANEL"
        editor={{
          darkMode: resolvedTheme === 'dark',
        }}
        style={{ height: '50vh' }}
      />
      <div style={{ textAlign: 'right', fontSize: '14px' }}>
        ⚡ by{' '}
        <Link href="https://node-repl.pages.dev/" target="_blank">
          React Node REPL
        </Link>
      </div>
    </div>
  );
}
