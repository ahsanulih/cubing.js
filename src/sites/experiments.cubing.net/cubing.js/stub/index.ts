// Stub file for testing.
// Feel free to add code here if you need a quick place to run some code, but avoid committing any changes.

import { Alg } from "../../../../cubing/alg";
import { TwistyPlayerV2 } from "../../../../cubing/twisty/dom/twisty-player-model/controllers/TwistyPlayerV2";
import { indexerStrategyNames } from "../../../../cubing/twisty/dom/twisty-player-model/props/depth-0/IndexerConstructorRequestProp";
import {
  backgroundThemes,
  controlsLocations,
  experimentalStickerings,
  hintFaceletStyles,
  PuzzleID,
  puzzleIDs,
  setupToLocations,
  viewerLinkPages,
  visualizationFormats,
} from "../../../../cubing/twisty/dom/TwistyPlayerConfig";
import { backViewLayouts } from "../../../../cubing/twisty/dom/viewers/TwistyViewerWrapper";

// Note: this file needs to contain code to avoid a Snowpack error.
// So we put a `console.log` here for now.
console.log("Loading stub file.");

(async () => {
  const puzzle = (new URL(location.href).searchParams.get("puzzle") ??
    "gigaminx") as PuzzleID;

  const twistyPlayer = document.body.appendChild(
    new TwistyPlayerV2({ puzzle }),
  );

  const alg =
    puzzle === "gigaminx"
      ? "(BL2 B2' DL2' B' BL' B' DL2' BL2 B' BL2' B2 BL DL2 B' DL BL B' BL2 DR2 U' (F2 FR2' D2 FR L2' 1-4BR 1-4R2' U)5 F2 FR2' D2 FR L2' 1-4BR 1-4R2' U2 2DR2 u2' 1-3R2 1-3BR' l2 fr' d2' fr2 f2' (u' 1-3R2 1-3BR' l2 fr' d2' fr2 f2')5 u dr2' bl2' b bl' dl' b dl2' bl' b2' bl2 b bl2' dl2 b bl b dl2 b2 bl2')"
      : "R U R' U R U2' R'";
  twistyPlayer.alg = alg;

  const table = document.body.appendChild(document.createElement("table"));

  const algOptions: [string, string, Alg][] = [
    ["alg", "alg", Alg.fromString(alg)],
    ["setup", "setup", Alg.fromString("")],
  ];

  for (const [propName, attrName, alg] of algOptions) {
    const tr = table.appendChild(document.createElement("tr"));

    const td1 = tr.appendChild(document.createElement("td"));
    td1.appendChild(document.createElement("code")).textContent = attrName;

    const td2 = tr.appendChild(document.createElement("td"));
    const input = td2.appendChild(document.createElement("input"));
    input.value = alg.toString();
    input.placeholder = "(none)";
    const update = () => {
      (twistyPlayer as any)[propName] = input.value;
    };
    input.addEventListener("change", update);
    input.addEventListener("keyup", update);
    update();
  }

  const enumOptions: [string, string, Record<string, any>, string?][] = [
    ["anchor", "anchor", setupToLocations],
    ["puzzle", "puzzle", puzzleIDs, puzzle],
    [
      "visualization",
      "visualization",
      Object.assign({ auto: true }, visualizationFormats),
    ],
    [
      "hintFacelets",
      "hint-facelets",
      Object.assign({ auto: true }, hintFaceletStyles),
    ],
    ["stickering", "stickering", experimentalStickerings],

    [
      "background",
      "background",
      Object.assign({ auto: true }, backgroundThemes),
    ],
    [
      "controlPanel",
      "control-panel",
      Object.assign({ auto: true }, controlsLocations),
    ],

    ["backView", "back-view", Object.assign({ auto: true }, backViewLayouts)],

    ["indexer", "indexer", Object.assign({ auto: true }, indexerStrategyNames)],
    // [
    //   "experimentalCameraLatitudeLimits",
    //   "experimental-camera-latitude-limits",
    //   cameraLatitudeLimits,
    // ],

    [
      "viewerLink",
      "viewer-link",
      Object.assign({ auto: true }, viewerLinkPages),
    ],
  ];

  for (const [propName, attrName, valueMap, defaultValue] of enumOptions) {
    const tr = table.appendChild(document.createElement("tr"));

    const td1 = tr.appendChild(document.createElement("td"));
    td1.appendChild(document.createElement("code")).textContent = attrName;

    const td2 = tr.appendChild(document.createElement("td"));
    const select = document.createElement("select");
    td2.appendChild(select);

    for (const value in valueMap) {
      const optionElem = select.appendChild(document.createElement("option"));
      optionElem.textContent = value;
      optionElem.value = value;

      if (value === defaultValue) {
        optionElem.selected = true;
      }
    }
    select.addEventListener("change", () => {
      console.log(attrName, select.value);
      if (propName in twistyPlayer) {
        (twistyPlayer as any)[propName] = select.value as any;
      } else {
        console.error("Invalid prop name!", propName);
      }
    });
    document.body.append(document.createElement("br"));
  }

  const numberOptions: [string, string, number | null][] = [
    ["cameraLatitude", "camera-latitude", null],
    ["cameraLongitude", "camera-longitude", null],
    ["cameraDistance", "camera-distance", 6],
    ["cameraLatitudeLimit", "camera-latitude-limit", 35],
  ];

  for (const [propName, attrName, initialValue] of numberOptions) {
    const tr = table.appendChild(document.createElement("tr"));

    const td1 = tr.appendChild(document.createElement("td"));
    td1.appendChild(document.createElement("code")).textContent = attrName;

    const td2 = tr.appendChild(document.createElement("td"));
    const input = td2.appendChild(document.createElement("input"));
    console.log(propName, initialValue, initialValue !== null);
    if (initialValue !== null) {
      input.value = initialValue.toString();
    }
    input.type = "number";
    input.placeholder = "(no value)";
    const update = () => {
      if (input.value === "") {
        return;
      }
      (twistyPlayer as any)[propName] = input.value;
    };
    input.addEventListener("input", update);
    // input.addEventListener("change", update);
    input.addEventListener("keyup", update);
  }
})();
