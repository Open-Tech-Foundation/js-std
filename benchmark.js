import { isDeepStrictEqual } from "node:util";
import { Bench, hrtimeNow } from "tinybench";
import { clone, sortBy, isEql } from "./packages/utils/dist/index";
import _ from "lodash";
import * as R from "ramda";
import * as R2 from "remeda";
import { sort as mSort } from "moderndash";
import fastDeepEqual from "fast-deep-equal/es6";

async function cloneBench() {
  console.log("clone:");
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
    k: { a: [{ b: [10, 20, 30] }] },
  };

  bench
    .add("structuredClone (Native)", () => {
      structuredClone(obj);
    })
    .add("_.cloneDeep (Lodash)", () => {
      _.cloneDeep(obj);
    })
    .add("R.clone (ramda)", () => {
      R.clone(obj);
    })
    .add("R2.clone (remeda)", () => {
      R2.clone(obj);
    })
    .add("clone", () => {
      clone(obj);
    })
    .todo("unimplemented bench");

  await bench.warmup();
  await bench.run();

  console.table(bench.table());
  console.log(
    "*Note: Here the ramda & remeda does not support cloning Map & Set."
  );
}

async function sortByBench() {
  console.log("sortBy:");
  const bench = new Bench({ time: 100, now: hrtimeNow });
  const users = [
    { name: "fred", age: 48 },
    { name: "barney", age: 34 },
    { name: "fred", age: 40 },
    { name: "barney", age: 36 },
  ];

  await bench.warmup();
  bench
    .add("_.orderBy (Lodash)", () => {
      _.orderBy(users, ["name", "age"], ["asc", "desc"]);
    })
    .add("R.sortWith (Ramda)", () => {
      const ageNameSort = R.sortWith([
        R.ascend(R.prop("name")),
        R.descend(R.prop("age")),
      ]);
      ageNameSort(users);
    })
    .add("R2.sortBy (Remeda)", () => {
      R2.sortBy(users, [(x) => x.name, "asc"], [(x) => x.age, "desc"]);
    })
    .add("sort (Moderndash)", () => {
      mSort(
        users,
        { order: "asc", by: (item) => item.name },
        { order: "desc", by: (item) => item.age }
      );
    })
    .add("sortBy", () => {
      sortBy(users, ["name", "asc"], ["age", "desc"]);
    });

  await bench.warmup();
  await bench.run();

  console.table(bench.table());
}

async function isEqlBench() {
  console.log("isEql:");
  const bench = new Bench({ time: 100, now: hrtimeNow });
  const obj = {
    a: undefined,
    b: null,
    c: 0,
    d: -0,
    e: 1,
    f: 1n,
    g: "a",
    h: [1, 2, 3],
    i: {
      j: true,
      k: false,
      l: new Date(),
      l2: [new Uint8Array(10), new Float32Array(32)],
    },
    m: new Map([
      ["1", 1],
      ["2", 2],
    ]),
    n: new Set([1, 2, 3, 4, 5]),
  };
  const obj2 = structuredClone(obj);

  await bench.warmup();
  bench
    .add("deepStrictEqual (Native)", () => {
      isDeepStrictEqual(obj, obj2);
    })
    .add("fastDeepEqual (fast-deep-equal/es6)", () => {
      fastDeepEqual(obj, obj2);
    })
    .add("_.isEqual (Lodash)", () => {
      _.isEqual(obj, obj2);
    })
    .add("R.equals (Ramda)", () => {
      R.equals(obj, obj2);
    })
    .add("isEql", () => {
      isEql(obj, obj2);
    });

  await bench.warmup();
  await bench.run();

  console.table(bench.table());
}

// await cloneBench();
// await sortByBench();
await isEqlBench();
