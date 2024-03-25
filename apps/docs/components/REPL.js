"use client";
import dynamic from "next/dynamic";
import "@opentf/react-node-repl/lib/style.css";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

const NodeREPL = dynamic(
  () => import("@opentf/react-node-repl").then((mod) => mod.NodeREPL),
  { ssr: false }
);

const setupCode = `const _ = require('lodash');
const R = require('ramda');
const log = console.log;`;

export default function REPL({ code = "", layout = "DEFAULT" }) {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 1,
    triggerOnce: true,
  });
  const { resolvedTheme } = useTheme();

  return (
    <div ref={ref}>
      {inView && (
        <div style={{ padding: "5px" }}>
          <NodeREPL
            code={code}
            setupCode={setupCode}
            deps={["@opentf/std", "lodash", 'ramda']}
            editor={{
              darkMode: resolvedTheme === "dark",
              header: false,
              style: { minHeight: "150px", maxHeight: "300px" },
            }}
            terminal={{
              show: false,
              style: { minHeight: "150px", maxHeight: "300px" },
            }}
            console={{ style: { minHeight: "150px", maxHeight: "300px" } }}
          />
          <div style={{ textAlign: "right", fontSize: "14px" }}>
            ⚡ by{" "}
            <Link href="https://node-repl.pages.dev/" target="_blank">
              React Node REPL
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
