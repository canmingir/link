import ELK from "elkjs/lib/elk.bundled.js";
import type { FlowNodeMap } from "../types";
import { toNextArray } from "./flowUtils";

const elk = new ELK();

export const DEFAULT_NODE_WIDTH = 220;
export const DEFAULT_NODE_HEIGHT = 120;

export interface DagLayoutEdge {
  id: string;
  source: string;
  target: string;
  branch: string;
}

export type DagLayoutPositions = Record<
  string,
  { x: number; y: number; width: number; height: number }
>;

export interface DagLayoutBounds {
  width: number;
  height: number;
}

export interface DagLayoutResult {
  positions: DagLayoutPositions;
  edges: DagLayoutEdge[];
  bounds: DagLayoutBounds;
}

export type DagDirection = "RIGHT" | "DOWN" | "LEFT" | "UP";

export function buildLayoutEdges(
  nodesById: FlowNodeMap | undefined
): DagLayoutEdge[] {
  const edges: DagLayoutEdge[] = [];
  const seen = new Set<string>();

  const push = (source: string, target: string | undefined, branch: string) => {
    if (!target || !nodesById?.[target]) return;
    const id = `${source}->${target}:${branch}`;
    if (seen.has(id)) return;
    seen.add(id);
    edges.push({ id, source, target, branch });
  };

  for (const node of Object.values(nodesById ?? {})) {
    const trueNext = (node.trueNext as string[] | undefined) ?? [];
    const falseNext = (node.falseNext as string[] | undefined) ?? [];

    for (const target of trueNext) push(node.id, target, "true");
    for (const target of falseNext) push(node.id, target, "false");

    if (trueNext.length || falseNext.length) continue;

    const nextTargets = toNextArray(node.next);
    const branch = nextTargets.length > 1 ? "case" : "next";

    for (const target of nextTargets) {
      push(node.id, target, branch);
    }
  }

  return edges;
}

function analyzeEdges(edges: DagLayoutEdge[]): {
  hasConditionalBranching: boolean;
  maxBranchingFactor: number;
  maxMergingFactor: number;
  hasMergePoints: boolean;
} {
  const incomingCount: Record<string, number> = {};
  const outgoingCount: Record<string, number> = {};
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

function withExtraSpacing(
  options: Record<string, string>,
  extraSpacing: number,
  direction: DagDirection
): Record<string, string> {
  if (!extraSpacing) return options;

  const key =
    direction === "RIGHT"
      ? "elk.spacing.nodeNode"
      : "elk.layered.spacing.nodeNodeBetweenLayers";

  return { ...options, [key]: String(Number(options[key]) + extraSpacing) };
}

function buildElkOptions(
  stats: {
    hasConditionalBranching: boolean;
    maxBranchingFactor: number;
    maxMergingFactor: number;
    hasMergePoints: boolean;
  },
  direction: DagDirection
) {
  let options: Record<string, string> = {
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
        stats.maxBranchingFactor * 30
      ).toString(),
      "elk.spacing.nodeNode": Math.max(
        100,
        stats.maxBranchingFactor * 25
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

function centerMergePoints(
  positions: DagLayoutPositions,
  edges: DagLayoutEdge[],
  direction: DagDirection
): void {
  const parentsOf: Record<string, string[]> = {};
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
      .filter(
        (p): p is { x: number; y: number; width: number; height: number } =>
          Boolean(p)
      )
      .map((p) => p[crossAxis] + p[crossSize] / 2);

    if (parentCenters.length < 2) continue;

    const target =
      (Math.min(...parentCenters) + Math.max(...parentCenters)) / 2;
    box[crossAxis] = target - box[crossSize] / 2;
  }
}

export async function computeDagLayout(
  nodesById: FlowNodeMap | undefined,
  options: {
    direction?: DagDirection;
    sizeFor?: (
      node: FlowNodeMap[string]
    ) => { width?: number; height?: number; extraSpacing?: number } | undefined;
  } = {}
): Promise<DagLayoutResult> {
  const direction = options.direction ?? "RIGHT";
  const nodeIds = Object.keys(nodesById ?? {});

  if (!nodeIds.length) {
    return { positions: {}, edges: [], bounds: { width: 0, height: 0 } };
  }

  const edges = buildLayoutEdges(nodesById);
  const stats = analyzeEdges(edges);

  const sizes: Record<
    string,
    { width: number; height: number; extraSpacing: number }
  > = {};
  let extraSpacing = 0;
  for (const id of nodeIds) {
    const size = options.sizeFor?.(nodesById![id]) ?? {};
    sizes[id] = {
      width: size.width ?? DEFAULT_NODE_WIDTH,
      height: size.height ?? DEFAULT_NODE_HEIGHT,
      extraSpacing: size.extraSpacing ?? 0,
    };
    extraSpacing = Math.max(extraSpacing, size.extraSpacing ?? 0);
  }

  const layouted = await elk.layout({
    id: "root",
    layoutOptions: withExtraSpacing(
      buildElkOptions(stats, direction),
      extraSpacing,
      direction
    ),
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

  const positions: DagLayoutPositions = {};
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
