"use client";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import Link from "next/link";
import "@opentf/react-node-repl/lib/style.css";

const NodeREPL = dynamic(
  () => import("@opentf/react-node-repl").then((mod) => mod.NodeREPL),
  { ssr: false }
);

const code = `const {
  isNum,
  pascalCase,
  sort,
  clone,
  isEql,
  isEqlArr,
  diff,
} = require("@opentf/std");

log(isNum(NaN));

log(pascalCase("pascal case"));

log(sort([1, 10, 21, 2], "desc"));

const obj = {
  a: 1,
  b: "abc",
  c: new Map([["key", "val"]]),
};
log(clone(obj));

const mapA = new Map([
  ["a", 1],
  ["b", 2],
]);
const mapB = new Map([
  ["b", 2],
  ["a", 1],
]);
log(isEql(mapA, mapB));

log(isEqlArr([1, 2, 3], [2, 3, 1]));

diff([
  ['apple', 'mango', 'orange'], 
  ['mango', 'apple']
])
`;

const setupCode = `const _ = require('lodash');
const R = require('ramda');
const log = console.log;`;

export default function PlaygroundREPL() {
  const { resolvedTheme } = useTheme();

  return (
    <div style={{ padding: "25px" }}>
      <NodeREPL
        code={code}
        setupCode={setupCode}
        deps={["@opentf/std", "lodash", "ramda"]}
        layout="SPLIT_PANEL"
        editor={{
          darkMode: resolvedTheme === "dark",
        }}
        style={{ height: "50vh" }}
      />
      <div style={{ textAlign: "right", fontSize: "14px" }}>
        ⚡ by{" "}
        <Link href="https://node-repl.pages.dev/" target="_blank">
          React Node REPL
        </Link>
      </div>
    </div>
  );
}
