import { SandBox } from "@opentf/react-sandbox";
import Source from "!!raw-loader!../Source.js";
import React from "react";
import Layout from "@theme/Layout";

export default function Playground() {
  return (
    <Layout
      title="Playground"
      description="The code sandbox for live editing examples here."
    >
      <div
        style={{
          display: "flex",
          height: "75vh",
        }}
      >
        <SandBox
          template="vanilla"
          code={Source}
          layout="Code_Console"
          consoleType="Advanced"
          deps={["@opentf/utils"]}
          style={{ height: "inherit", width: "100%" }}
        />
      </div>
    </Layout>
  );
}
