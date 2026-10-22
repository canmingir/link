export interface FlowNode {
  id: string;
  next?: FlowNext;
  previous?: string | null;
  children?: FlowNode[];
  [key: string]: unknown;
}

export type FlowNextRef = string | { id: string };

export type FlowNext = FlowNextRef | FlowNextRef[] | null | undefined;

export type FlowNodeMap = Record<string, FlowNode>;
export interface LinkedGraph {
  nodes: FlowNodeMap;
  roots?: string[];
}

export interface FlowStructure {
  nodes: FlowNodeMap;
  roots: string[];
}

export interface TreeNode {
  id: string;
  previous?: string | null;
  next?: FlowNext;
  children: TreeNode[];
  [key: string]: unknown;
}

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
export interface FlowViewportHandle {
  fitView: (options?: FitViewOptions) => void;
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  setZoom: (zoom: number) => void;
  setCenter: (x: number, y: number, options?: SetCenterOptions) => void;
  getZoom: () => number;
}
