import { NodeREPL } from "@opentf/react-node-repl";
import { mountReact, readTheme } from "./react-bridge.js";

const setupCode = `const _ = require('lodash');
const R = require('ramda');
const log = console.log;`;

function ReplPanel(props) {
  const darkMode = readTheme() === "dark";
  return (
    <div style={{ padding: "5px" }}>
      <NodeREPL
        code={props.code || ""}
        setupCode={setupCode}
        deps={["@opentf/std@1.0.0-beta.3", "lodash", "ramda"]}
        editor={{
          darkMode,
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
        <a href="https://node-repl.pages.dev/" target="_blank" rel="noreferrer">
          React Node REPL
        </a>
      </div>
    </div>
  );
}

export default function REPL(props) {
  let host = $ref();
  let dispose = null;

  onMount(() => {
    if (!host) return;
    dispose = mountReact(host, ReplPanel, { code: props.code });
    onCleanup(() => dispose?.());
  });

  return <div ref={host} />;
}