import { Bench } from "tinybench";
import { clone } from "./packages/utils";
import _ from "lodash";

async function cloneBench() {
  console.log("Clone:");
  const bench = new Bench({ time: 100 });
  const obj = {
    a: undefined,
    b: null,
    c: false,
    d: true,
    e: 1,
    f: 10.55,
    g: 1000n,
    f: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    h: new Map([
      [1, 1],
      [2, 2],
    ]),
    i: new Set([1, 2, 3, 4, 5]),
    j: new Date(),
  };

  bench
    .add("structuredClone (Native)", () => {
      structuredClone(obj);
    })
    .add("_.cloneDeep (Lodash)", () => {
      _.cloneDeep(obj);
    })
    .add("clone", () => {
      clone(obj);
    })
    .todo("unimplemented bench");

  await bench.warmup();
  await bench.run();

  console.table(bench.table());
}

await cloneBench();
