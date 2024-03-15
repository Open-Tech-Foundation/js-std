"use client";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import Link from "next/link";
import "@opentf/react-node-repl/lib/style.css";

const NodeREPL = dynamic(
  () => import("@opentf/react-node-repl").then((mod) => mod.NodeREPL),
  { ssr: false }
);

const code = `const { range, arrDiff, camelCase } = require('@opentf/utils');

log(arrDiff(
  ['apple', 'mango', 'orange'], 
  ['mango', 'apple']
));
log(range(1, 8));
log(camelCase('i phone'));
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
        deps={["@opentf/utils", "lodash", "ramda"]}
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
