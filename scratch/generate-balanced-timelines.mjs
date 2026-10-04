import fs from "fs";

// Read existing MCU timeline
const mcuContent = fs.readFileSync("config/timelines/mcu.ts", "utf-8");
const starWarsContent = fs.readFileSync("config/timelines/star-wars.ts", "utf-8");

// Parse nodes from mcu.ts
const mcuNodesMatch = mcuContent.match(/nodes:\s*(\[[\s\S]*?\n\s*\]),/);
if (!mcuNodesMatch) {
  console.error("Could not find nodes in mcu.ts");
  process.exit(1);
}

const rawMcuNodes = JSON.parse(mcuNodesMatch[1]);
console.log(`Found ${rawMcuNodes.length} MCU nodes`);

// Group MCU nodes by branch
let currentX = 60;
const processedMcuNodes = [];

// Branch definitions
// Sacred timeline main sequence
const tvaIds = new Set(["mcu-loki", "mcu-loki-s2", "mcu-whatif-s1", "mcu-whatif-s2", "mcu-whatif-s3", "mcu-deadpool-wolverine", "mcu-fantastic-four"]);
const multiverseIds = new Set(["mcu-xmen-97", "mcu-friendly-neighborhood-spiderman"]);

let sacredX = 60;
let tvaX = 1400;
let multiverseX = 1550;

for (const node of rawMcuNodes) {
  const isAnchor = !!node.data.isAnchor;
  const isTva = node.data.canonType === "tva" || node.data.canonType === "outside-time" || tvaIds.has(node.id);
  const isMulti = node.data.canonType === "multiverse" || multiverseIds.has(node.id);

  let x = sacredX;
  let y = 300;

  if (isTva) {
    x = tvaX;
    y = 120;
    tvaX += isAnchor ? 120 : 76;
  } else if (isMulti) {
    x = multiverseX;
    y = 480;
    multiverseX += isAnchor ? 120 : 76;
  } else {
    x = sacredX;
    y = 300;
    sacredX += isAnchor ? 120 : 76;
  }

  // Anchor special positions if needed
  processedMcuNodes.push({
    id: node.id,
    type: "mediaNode",
    position: { x, y },
    data: node.data,
  });
}

console.log(`MCU Sacred total width: ${sacredX}px`);

// Write out new MCU timeline
const newMcuTs = mcuContent.replace(
  /nodes:\s*\[[\s\S]*?\n\s*\],/,
  `nodes: ${JSON.stringify(processedMcuNodes, null, 2)},`
);
fs.writeFileSync("config/timelines/mcu.ts", newMcuTs);

// Now process Star Wars nodes similarly
const swNodesMatch = starWarsContent.match(/nodes:\s*(\[[\s\S]*?\n\s*\]),/);
if (swNodesMatch) {
  const rawSwNodes = JSON.parse(swNodesMatch[1]);
  console.log(`Found ${rawSwNodes.length} Star Wars nodes`);

  let swSacredX = 60;
  let swTalesX = 800;
  let swMandoX = 1800;

  const processedSwNodes = [];
  for (const node of rawSwNodes) {
    const isAnchor = !!node.data.isAnchor;
    const isTales = node.data.branchName === "Star Wars Tales" || node.data.canonType === "tales";
    const isMando = node.data.branchName === "The New Republic" || node.data.canonType === "mandoverse" || node.data.canonType === "rebellion";

    let x = swSacredX;
    let y = 300;

    if (isTales) {
      x = swTalesX;
      y = 120;
      swTalesX += isAnchor ? 120 : 76;
    } else if (isMando) {
      x = swMandoX;
      y = 480;
      swMandoX += isAnchor ? 120 : 76;
    } else {
      x = swSacredX;
      y = 300;
      swSacredX += isAnchor ? 120 : 76;
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

console.log("Balanced timelines generated successfully!");
