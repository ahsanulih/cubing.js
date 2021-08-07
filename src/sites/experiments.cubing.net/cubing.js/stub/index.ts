// Stub file for testing.
// Feel free to add code here if you need a quick place to run some code, but avoid committing any changes.

import { AlgProp } from "../../../../cubing/twisty/dom/twisty-player-model/depth-1/AlgProp";
import { IndexerConstructorProp } from "../../../../cubing/twisty/dom/twisty-player-model/depth-1/IndexerConstructorProp";
import { PuzzleProp } from "../../../../cubing/twisty/dom/twisty-player-model/depth-1/PuzzleProp";
import { PuzzleDefProp } from "../../../../cubing/twisty/dom/twisty-player-model/depth-2/PuzzleDef";
import { PuzzleAlgProp } from "../../../../cubing/twisty/dom/twisty-player-model/depth-3/PuzzleAlgProp";
import { IndexerProp } from "../../../../cubing/twisty/dom/twisty-player-model/depth-4/IndexerProp";
import {
  SimpleTwistyPropSource,
  TwistyPropDerived,
} from "../../../../cubing/twisty/dom/twisty-player-model/TwistyProp";

// Note: this file needs to contain code to avoid a Snowpack error.
// So we put a `console.log` here for now.
console.log("Loading stub file.");

class A extends SimpleTwistyPropSource<number> {
  getDefaultValue: () => 4;
}

class B extends TwistyPropDerived<{ a: number }, number> {
  async derive(input: { a: number }): Promise<number> {
    await new Promise(async (resolve) =>
      setTimeout(resolve, Math.random() * 100),
    );
    return (input.a * 2) % 17;
  }
}

class C extends TwistyPropDerived<{ a: number }, number> {
  async derive(input: { a: number }): Promise<number> {
    await new Promise(async (resolve) =>
      setTimeout(resolve, Math.random() * 10),
    );
    return (input.a * 3) % 17;
  }
}

class D extends TwistyPropDerived<{ b: number; c: number }, boolean> {
  derive(input: { b: number; c: number }): boolean {
    return input.b > input.c;
  }
}

const a = new A(2);
const b = new B({ a });
const c = new C({ a });
const d = new D({ b, c });

async function f() {
  console.log(await a.get(), await b.get(), await c.get(), await d.get());
  a.set(6);
  console.log(await a.get(), await b.get(), await c.get(), await d.get());
  a.set(8);
  console.log(await a.get(), await b.get(), await c.get(), await d.get());
  for (let i = 0; i < 17; i++) {
    a.set(i);
    console.log(await a.get(), await d.get());
  }

  for (let i = 0; i < 17; i++) {
    a.set(i);
    d.get().then(async (dv) => console.log(i, await a.get(), dv));
    await new Promise(async (resolve) =>
      setTimeout(resolve, Math.random() * 5),
    );
  }
}
if (false) {
  f();
}

const algProp = new AlgProp();
const puzzleProp = new PuzzleProp();
const puzzleDefProp = new PuzzleDefProp({ puzzle: puzzleProp });
const puzzleAlgProp = new PuzzleAlgProp({
  algWithIssues: algProp,
  puzzleDef: puzzleDefProp,
});

const indexerConstructor = new IndexerConstructorProp();
const indexerProp = new IndexerProp({
  indexerConstructor: indexerConstructor,
  algWithIssues: puzzleAlgProp,
  def: puzzleDefProp,
});

indexerProp.addListener(async () => {
  const indexer = await indexerProp.get();
  console.log(indexer.algDuration());
});

algProp.set("U D");
console.log("a1", (await indexerProp.get()).algDuration());
algProp.set("(U D)");
console.log("a2", (await indexerProp.get()).algDuration());
indexerConstructor.set("simultaneous");
const g = indexerProp.get();
console.log("a4", (await indexerProp.get()).algDuration());
algProp.set("(U D E2)");
console.log("a5", (await g).algDuration());

indexerConstructor.set("tree");
console.log("a6", (await indexerProp.get()).algDuration());

// // (await puzzleAlgProp.get()).alg.log();
// // puzzleAlgProp.addListener(console.log);

// algProp.set("R U R'");
// (await algProp.get()).alg.log(0);
// (async () => {
//   const g = puzzleAlgProp.get();
//   await new Promise(async (resolve) =>
//     setTimeout(resolve, Math.random() * 100),
//   );
//   (await g).alg.log(1);
// })();
// algProp.set("F2");
// (await algProp.get()).alg.log();
// (async () => {
//   const g = puzzleAlgProp.get();
//   await new Promise(async (resolve) =>
//     setTimeout(resolve, Math.random() * 100),
//   );
//   (await g).alg.log(2);
// })();
// algProp.set("L2");
// (async () => {
//   const g = await puzzleAlgProp.get();
//   (await g).alg.log(3);
// })();
// algProp.set("R++");
// (async () => {
//   const g = await puzzleAlgProp.get();
//   console.log(4, await g);
// })();
// puzzleProp.set("megaminx");
// (async () => {
//   const g = await puzzleAlgProp.get();
//   (await g).alg.log(5);
// })();
// puzzleProp.set("clock");
// (async () => {
//   const g = await puzzleAlgProp.get();
//   (await g).alg.log(6);
// })();
// algProp.set("UR1+");
// (async () => {
//   const g = await puzzleAlgProp.get();
//   (await g).alg.log(7);
// })();
