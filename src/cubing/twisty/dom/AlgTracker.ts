// TODO: see if this can replace AlgCursor?

import { Alg } from "../../alg";
import { algTrackerCSS } from "./AlgTracker.css_";
import { algTrackerStartCharSearch } from "./AlgTrackerStartCharSearch";
import { ClassListManager } from "./element/ClassListManager";
import { ManagedCustomElement } from "./element/ManagedCustomElement";
import { customElementsShim } from "./element/node-custom-element-shims";

export class AlgTracker extends ManagedCustomElement {
  #alg: Alg = new Alg();
  #textarea: HTMLTextAreaElement = document.createElement("textarea");

  #textareaClassListManager: ClassListManager<
    "none" | "warning" | "error"
  > = new ClassListManager(this, "issue-", ["none", "warning", "error"]);

  constructor() {
    super();
    this.addElement(this.#textarea);

    this.addCSS(algTrackerCSS);

    this.#textarea.addEventListener("input", () => this.onInput());
    document.addEventListener("selectionchange", () =>
      this.onSelectionChange(),
    );
  }

  // TODO
  set algString(s: string) {
    this.#textarea.value = s;
    this.onInput();
  }

  onInput(): void {
    try {
      this.#alg = new Alg(this.#textarea.value);
      this.dispatchEvent(
        new CustomEvent("effectiveAlgChange", { detail: { alg: this.#alg } }),
      );
      this.#textareaClassListManager.setValue(
        // TODO: better heuristics to avoid warning during editing
        this.#alg.toString().trimEnd() === this.#textarea.value.trimEnd()
          ? "none"
          : "warning",
      );
    } catch (e) {
      this.#alg = new Alg();
      this.dispatchEvent(
        new CustomEvent("effectiveAlgChange", { detail: { alg: this.#alg } }),
      );
      this.#textareaClassListManager.setValue("error");
    }
    console.log(this.#alg);
  }

  onSelectionChange(): void {
    if (
      document.activeElement !== this ||
      this.shadow.activeElement !== this.#textarea
    ) {
      return;
    }
    console.log(this.#textarea.selectionStart);
    const dataUp = algTrackerStartCharSearch(this.#alg, {
      startCharIdxMin: this.#textarea.selectionStart,
      numMovesSofar: 0,
    });
    if ("latestUnit" in dataUp) {
      this.dispatchEvent(
        new CustomEvent("animatedMoveIndexChange", {
          detail: { idx: dataUp.animatedMoveIdx },
        }),
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("animatedMoveIndexChange", {
          detail: { idx: dataUp.animatedMoveCount },
        }),
      );
    }
  }
}

customElementsShim.define("alg-tracker", AlgTracker);
