import { NodeREPL } from '@opentf/react-node-repl';
import { mountReact, readTheme } from './react-bridge.js';

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
const original = {
  name: "JS Std",
  meta: new Map([["version", "beta.3"]]),
  tags: new Set(["modern", "fast"]),
  created: new Date()
};
original.self = original;

const cloned = clone(original);
log("Cloned successfully:", cloned !== original && isEql(cloned, original));

// --- 2. Smart Equality ---
const mapA = new Map([["a", 1], ["b", 2]]);
const mapB = new Map([["b", 2], ["a", 1]]);
log("Map Eql (Strict Order):", isEql(mapA, mapB));

// --- 3. Modern Async ---
async function demoAsync() {
  const { promise, resolve } = withResolvers();
  setTimeout(() => resolve("Async data fetched!"), 500);
  const data = await promise;
  log(data);

  const results = await mapAsync([1, 2, 3], async (n) => n * 2, 2);
  log("Processed async:", results);
}

demoAsync();

// --- 4. Colors ---
const brandHex = color("royalblue", "hex");
const brandRGB = color("royalblue", "rgb");
log("RoyalBlue Hex:", brandHex);
log("RoyalBlue RGB:", brandRGB);

// --- 5. Robust Types ---
log("isNumber(NaN):", isNumber(NaN));
log("isNumber('123', true):", isNumber('123', true));
`;

const setupCode = `const _ = require('lodash');
const R = require('ramda');
const log = console.log;`;

function PlaygroundPanel() {
  const darkMode = readTheme() === 'dark';
  return (
    <div style={{ padding: '25px' }}>
      <NodeREPL
        code={code}
        setupCode={setupCode}
        deps={['@opentf/std@1.0.0-beta.3', 'lodash', 'ramda']}
        layout="SPLIT_PANEL"
        editor={{ darkMode }}
        style={{ height: '50vh' }}
      />
      <div style={{ textAlign: 'right', fontSize: '14px' }}>
        ⚡ by{' '}
        <a href="https://node-repl.pages.dev/" target="_blank" rel="noreferrer">
          React Node REPL
        </a>
      </div>
    </div>
  );
}

export default function PlaygroundREPL() {
  const host = $ref();
  let dispose = null;

  onMount(() => {
    if (!host) return;
    dispose = mountReact(host, PlaygroundPanel);
    onCleanup(() => dispose?.());
  });

  return <div ref={host} />;
}
