/**
 * Core data shapes for the Flow graph.
 *
 * A flow is stored as a *linked graph*: a flat `nodes` map keyed by id, where
 * each node points at its successor(s) via `next` and (optionally) its
 * predecessor via `previous`. Layout code turns this into a `TreeNode` with
 * an explicit `children` array.
 */

/** A single node in the linked-graph representation. Domain fields (label,
 * title, description, ...) live alongside the structural ones, so the type is
 * open-ended. */
export interface FlowNode {
  id: string;
  /** Successor id(s). A string, an array of strings, or objects carrying an
   * `id`. Absent when the node is a leaf. */
  next?: FlowNext;
  /** Predecessor id, when the node is not a root. */
  previous?: string | null;
  children?: FlowNode[];
  [key: string]: unknown;
}

export type FlowNextRef = string | { id: string };

export type FlowNext = FlowNextRef | FlowNextRef[] | null | undefined;

/** Flat id → node map. */
export type FlowNodeMap = Record<string, FlowNode>;

/** The persisted graph passed into `<FlowChart data=... />`. */
export interface LinkedGraph {
  nodes: FlowNodeMap;
  roots?: string[];
}

/** A fully-resolved graph: guaranteed `nodes` map plus concrete root ids. */
export interface FlowStructure {
  nodes: FlowNodeMap;
  roots: string[];
}

/** A node expanded into an explicit tree, produced by the layout helpers. */
export interface TreeNode {
  id: string;
  previous?: string | null;
  next?: FlowNext;
  children: TreeNode[];
  [key: string]: unknown;
}

/** Result of {@link getContentParts}. */
export interface NodeContentParts {
  title: string;
  subtitle: string | null;
  metaEntries: [string, unknown][];
}

export interface Point {
  x: number;
  y: number;
}

export type FitAlign = "center" | "start";

export interface FitViewOptions {
  padding?: number;
  minZoom?: number;
  maxZoom?: number;
  align?: FitAlign;
}

export interface SetCenterOptions {
  zoom?: number;
}

/** Imperative API exposed by `<FlowViewport>` via ref / `onInit`. */
export interface FlowViewportHandle {
  fitView: (options?: FitViewOptions) => void;
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  setZoom: (zoom: number) => void;
  setCenter: (x: number, y: number, options?: SetCenterOptions) => void;
  getZoom: () => number;
}
