import ELK from "elkjs/lib/elk.bundled.js";

import { toNextArray } from "./flowUtils";

const elk = new ELK();

export const DEFAULT_NODE_WIDTH = 220;
export const DEFAULT_NODE_HEIGHT = 120;

export function buildLayoutEdges(nodesById) {
  const edges = [];
  const seen = new Set();

  const push = (source, target, branch) => {
    if (!target || !nodesById[target]) return;
    const id = `${source}->${target}:${branch}`;
    if (seen.has(id)) return;
    seen.add(id);
    edges.push({ id, source, target, branch });
  };

  for (const node of Object.values(nodesById ?? {})) {
    const trueNext = node.trueNext ?? [];
    const falseNext = node.falseNext ?? [];

    for (const target of trueNext) push(node.id, target, "true");
    for (const target of falseNext) push(node.id, target, "false");

    if (trueNext.length || falseNext.length) continue;

    for (const nxt of toNextArray(node.next)) {
      const target = typeof nxt === "string" ? nxt : nxt?.id;
      push(node.id, target, "next");
    }
  }

  return edges;
}

function analyzeEdges(edges) {
  const incomingCount = {};
  const outgoingCount = {};
  let hasConditionalBranching = false;

  for (const edge of edges) {
    incomingCount[edge.target] = (incomingCount[edge.target] ?? 0) + 1;
    outgoingCount[edge.source] = (outgoingCount[edge.source] ?? 0) + 1;
    if (edge.branch !== "next") hasConditionalBranching = true;
  }

  const maxBranchingFactor = Math.max(0, ...Object.values(outgoingCount));
  const maxMergingFactor = Math.max(0, ...Object.values(incomingCount));

  return {
    hasConditionalBranching,
    maxBranchingFactor,
    maxMergingFactor,
    hasMergePoints: maxMergingFactor > 1,
  };
}

function buildElkOptions(stats, direction) {
  let options = {
    "elk.algorithm": "layered",
    "elk.direction": direction,
    "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    "elk.spacing.nodeNode": "80",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
    "elk.layered.spacing.edgeNodeBetweenLayers": "60",
    "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
    "elk.layered.thoroughness": "7",
    "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
    "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
    "elk.layered.nodePlacement.favorStraightEdges": "true",
    "elk.layered.spacing.edgeEdgeBetweenLayers": "10",
  };

  if (stats.hasConditionalBranching) {
    options = {
      ...options,
      "elk.layered.spacing.nodeNodeBetweenLayers": "150",
      "elk.spacing.nodeNode": "120",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
      "elk.layered.nodePlacement.favorStraightEdges": "false",
      "elk.layered.mergeEdges": "false",
    };
  }

  if (stats.maxBranchingFactor > 2) {
    options = {
      ...options,
      "elk.layered.spacing.nodeNodeBetweenLayers": Math.max(
        120,
        stats.maxBranchingFactor * 30,
      ).toString(),
      "elk.spacing.nodeNode": Math.max(
        100,
        stats.maxBranchingFactor * 25,
      ).toString(),
    };
  }

  if (stats.hasMergePoints && stats.maxMergingFactor > 2) {
    options = {
      ...options,
      "elk.layered.spacing.edgeSpacing": "15",
      "elk.layered.mergeEdges": "true",
      "elk.layered.nodePlacement.favorStraightEdges": "true",
    };
  }

  if (stats.hasConditionalBranching && stats.hasMergePoints) {
    options = {
      ...options,
      "elk.layered.thoroughness": "10",
      "elk.layered.spacing.nodeNodeBetweenLayers": "180",
      "elk.spacing.nodeNode": "150",
    };
  }

  return options;
}

function centerMergePoints(positions, edges, direction) {
  const parentsOf = {};
  for (const edge of edges) {
    (parentsOf[edge.target] ??= []).push(edge.source);
  }

  const crossAxis = direction === "RIGHT" ? "y" : "x";
  const crossSize = direction === "RIGHT" ? "height" : "width";

  for (const [nodeId, parentIds] of Object.entries(parentsOf)) {
    if (parentIds.length < 2) continue;

    const box = positions[nodeId];
    if (!box) continue;

    const parentCenters = parentIds
      .map((id) => positions[id])
      .filter(Boolean)
      .map((p) => p[crossAxis] + p[crossSize] / 2);

    if (parentCenters.length < 2) continue;

    const target =
      (Math.min(...parentCenters) + Math.max(...parentCenters)) / 2;
    box[crossAxis] = target - box[crossSize] / 2;
  }
}

export async function computeDagLayout(nodesById, options = {}) {
  const direction = options.direction ?? "RIGHT";
  const nodeIds = Object.keys(nodesById ?? {});

  if (!nodeIds.length) {
    return { positions: {}, edges: [], bounds: { width: 0, height: 0 } };
  }

  const edges = buildLayoutEdges(nodesById);
  const stats = analyzeEdges(edges);

  const sizes = {};
  for (const id of nodeIds) {
    const size = options.sizeFor?.(nodesById[id]) ?? {};
    sizes[id] = {
      width: size.width ?? DEFAULT_NODE_WIDTH,
      height: size.height ?? DEFAULT_NODE_HEIGHT,
    };
  }

  const layouted = await elk.layout({
    id: "root",
    layoutOptions: buildElkOptions(stats, direction),
    children: nodeIds.map((id) => ({
      id,
      width: sizes[id].width,
      height: sizes[id].height,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  });

  const positions = {};
  for (const child of layouted.children ?? []) {
    positions[child.id] = {
      x: child.x ?? 0,
      y: child.y ?? 0,
      width: child.width ?? sizes[child.id]?.width ?? DEFAULT_NODE_WIDTH,
      height: child.height ?? sizes[child.id]?.height ?? DEFAULT_NODE_HEIGHT,
    };
  }

  centerMergePoints(positions, edges, direction);

  let width = 0;
  let height = 0;
  for (const box of Object.values(positions)) {
    width = Math.max(width, box.x + box.width);
    height = Math.max(height, box.y + box.height);
  }

  return { positions, edges, bounds: { width, height } };
}
