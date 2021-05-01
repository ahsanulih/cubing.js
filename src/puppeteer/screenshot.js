// We would use named imports, but that doesn't seem to be an option.
import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "./server.js";

const args = yargs(hideBin(process.argv))
  .command(
    "[alg]",
    "Screenshot an alg. (You can specify an empty alg string.)",
    () => {},
    (argv) => {
      console.info(argv);
    },
  )
  .option("puzzle", {
    type: "string",
  })
  .option("stickering", {
    type: "string",
  })
  .option("anchor", {
    type: "string",
    choices: ["start", "end"],
  })
  .option("hint-facelets", {
    type: "string",
    choices: ["none", "floating"],
  })
  .option("visualization", {
    type: "string",
  })
  .option("debug", {
    type: "boolean",
  })
  .option("out-file", {
    type: "string",
  })
  .option("size", {
    type: "number",
    default: 1024,
  })
  .strictOptions()
  .demandCommand(1).argv;

args.alg = args._[0];

const options = {
  alg: args.alg,
  puzzle: args.puzzle,
  experimentalStickering: args.stickering,
  experimentalSetupAnchor: args.anchor,
  hintFacelets: args["hint-facelets"],
  visualization: args.visualization,
};

for (const key in options) {
  if (typeof options[key] === "undefined") {
    delete options[key];
  }
}

console.log(options);

options.background = "none";
options.controlPanel = "none";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
    width: args["size"],
    height: args["size"],
  });

  const url = new URL("http://localhost:3334/");
  url.searchParams.set("options", JSON.stringify(options));

  if (args.debug) {
    console.log(url.toString());
  }

  await page.goto(url.toString());
  const path = args["out-file"] ?? `${args.alg || "puzzle"}.png`;
  console.log("Output file:", path);
  await page.screenshot({
    path,
    omitBackground: true,
    fullPage: true,
  });

  await browser.close();

  process.exit(0);
})();
