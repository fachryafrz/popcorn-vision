import fs from "fs";

// 1. Read existing MCU timeline
const mcuContent = fs.readFileSync("config/timelines/mcu.ts", "utf-8");
const starWarsContent = fs.readFileSync("config/timelines/star-wars.ts", "utf-8");

const mcuNodesMatch = mcuContent.match(/nodes:\s*(\[[\s\S]*?\n\s*\]),/);
if (!mcuNodesMatch) {
  console.error("Could not find nodes in mcu.ts");
  process.exit(1);
}

const rawMcuNodes = JSON.parse(mcuNodesMatch[1]);
console.log(`Found ${rawMcuNodes.length} MCU nodes`);

// Branch ID groups
const tvaIds = new Set([
  "mcu-loki",
  "mcu-loki-s2",
  "mcu-whatif-s1",
  "mcu-whatif-s2",
  "mcu-whatif-s3",
  "mcu-deadpool-wolverine",
  "mcu-fantastic-four",
]);

const multiverseIds = new Set([
  "mcu-xmen-97",
  "mcu-friendly-neighborhood-spiderman",
]);

let sacredX = 80;
let tvaX = 2200;
let multiverseX = 2600;

const processedMcuNodes = [];

for (const node of rawMcuNodes) {
  const isAnchor = !!node.data.isAnchor;
  const isTva =
    node.data.canonType === "tva" ||
    node.data.canonType === "outside-time" ||
    tvaIds.has(node.id);
  const isMulti =
    node.data.canonType === "multiverse" ||
    multiverseIds.has(node.id);

  let x = sacredX;
  let y = 450;

  if (isTva) {
    x = tvaX;
    y = 180;
    tvaX += isAnchor ? 180 : 135;
  } else if (isMulti) {
    x = multiverseX;
    y = 720;
    multiverseX += isAnchor ? 180 : 135;
  } else {
    x = sacredX;
    y = 450;
    sacredX += isAnchor ? 180 : 135;
  }

  processedMcuNodes.push({
    id: node.id,
    type: "mediaNode",
    position: { x, y },
    data: node.data,
  });
}

console.log(`MCU Sacred max X: ${sacredX}px, TVA max X: ${tvaX}px`);

const newMcuTs = mcuContent.replace(
  /nodes:\s*\[[\s\S]*?\n\s*\],/,
  `nodes: ${JSON.stringify(processedMcuNodes, null, 2)},`
);
fs.writeFileSync("config/timelines/mcu.ts", newMcuTs);

// 2. Process Star Wars nodes
const swNodesMatch = starWarsContent.match(/nodes:\s*(\[[\s\S]*?\n\s*\]),/);
if (swNodesMatch) {
  const rawSwNodes = JSON.parse(swNodesMatch[1]);
  console.log(`Found ${rawSwNodes.length} Star Wars nodes`);

  let swSacredX = 80;
  let swTalesX = 1400;
  let swMandoX = 2600;

  const processedSwNodes = [];
  for (const node of rawSwNodes) {
    const isAnchor = !!node.data.isAnchor;
    const isTales =
      node.data.branchName === "Star Wars Tales" ||
      node.data.canonType === "tales";
    const isMando =
      node.data.branchName === "The New Republic" ||
      node.data.canonType === "mandoverse" ||
      node.data.canonType === "rebellion";

    let x = swSacredX;
    let y = 450;

    if (isTales) {
      x = swTalesX;
      y = 180;
      swTalesX += isAnchor ? 180 : 135;
    } else if (isMando) {
      x = swMandoX;
      y = 720;
      swMandoX += isAnchor ? 180 : 135;
    } else {
      x = swSacredX;
      y = 450;
      swSacredX += isAnchor ? 180 : 135;
    }

    processedSwNodes.push({
      id: node.id,
      type: "mediaNode",
      position: { x, y },
      data: node.data,
    });
  }

  const newSwTs = starWarsContent.replace(
    /nodes:\s*\[[\s\S]*?\n\s*\],/,
    `nodes: ${JSON.stringify(processedSwNodes, null, 2)},`
  );
  fs.writeFileSync("config/timelines/star-wars.ts", newSwTs);
}

console.log("Expanded full-card timelines generated successfully!");
