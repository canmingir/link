import { useEffect, useMemo, useRef, useState } from "react";

import type {
  DagDirection,
  DagLayoutBounds,
  DagLayoutEdge,
  DagLayoutPositions,
  DagLayoutResult,
} from "../utils/dagLayout";
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  computeDagLayout,
} from "../utils/dagLayout";
import type {
  FlowPluginArg,
  FlowStylePlugin,
  FlowStyleResolver,
} from "./useNodeStyle";
import type { FlowNode, FlowNodeMap } from "../types";
import { getBaseStyleForVariant, toPxNumber } from "../styles";

interface ResolveTokensArgs {
  node: FlowNode;
  type?: string;
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
}

function resolveTokens({
  node,
  type,
  variant,
  style,
  plugin,
}: ResolveTokensArgs): Record<string, unknown> {
  const baseStyle = getBaseStyleForVariant(variant);

  let tokens: Record<string, unknown> = {};
  if (typeof style === "function") {
    tokens = style(node) || {};
  } else if (style && typeof style === "object") {
    tokens = style;
  }

  let resolvedPlugin: FlowStylePlugin | null = null;
  if (plugin) {
    resolvedPlugin =
      typeof plugin === "function" ? plugin(type, node) || null : plugin;
  }

  let pluginTokens: Record<string, unknown> = {};
  if (resolvedPlugin && typeof resolvedPlugin.style === "function") {
    pluginTokens = resolvedPlugin.style({ node, style: tokens }) || {};
  }

  return { ...baseStyle, ...tokens, ...pluginTokens };
}

interface SizeFromTokensResult {
  width: number;
  height: number;
  extraSpacing: number;
}

function sizeFromTokens(
  tokens: Record<string, unknown>
): SizeFromTokensResult {
  const width = (tokens.nodeWidth ??
    tokens.maxWidth ??
    tokens.minWidth ??
    tokens.cardWidth) as string | number | undefined;
  const height = (tokens.nodeHeight ?? tokens.maxHeight ?? tokens.minHeight) as
    | string
    | number
    | undefined;

  return {
    width: toPxNumber(width, DEFAULT_NODE_WIDTH),
    height: toPxNumber(height, DEFAULT_NODE_HEIGHT),
    extraSpacing: Math.max(
      0,
      toPxNumber(tokens.layoutExtraSpacing as string | number | undefined, 0)
    ),
  };
}

export interface UseDagLayoutArgs {
  nodesById?: FlowNodeMap;
  enabled?: boolean;
  direction?: DagDirection;
  type?: string;
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  positions?: DagLayoutPositions;
  layoutEdges?: DagLayoutEdge[];
  layoutBounds?: DagLayoutBounds;
  onLayoutError?: (error: unknown) => void;
}

export function useDagLayout({
  nodesById,
  enabled,
  direction,
  type,
  variant,
  style,
  plugin,
  positions,
  layoutEdges,
  layoutBounds,
  onLayoutError,
}: UseDagLayoutArgs): DagLayoutResult | null {
  const [computed, setComputed] = useState<DagLayoutResult | null>(null);
  const requestRef = useRef(0);

  const externalLayout = useMemo<DagLayoutResult | null>(
    () =>
      positions
        ? {
            positions,
            edges: layoutEdges ?? [],
            bounds: layoutBounds as DagLayoutBounds,
          }
        : null,
    [positions, layoutEdges, layoutBounds]
  );

  const sizeFor = useMemo(() => {
    return (node: FlowNode) =>
      sizeFromTokens(resolveTokens({ node, type, variant, style, plugin }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, variant, style, plugin]);

  const sizeForRef = useRef(sizeFor);
  sizeForRef.current = sizeFor;

  const onLayoutErrorRef = useRef(onLayoutError);
  onLayoutErrorRef.current = onLayoutError;

  const sizesKey = useMemo(() => {
    if (!enabled || !nodesById) return "";
    return Object.keys(nodesById)
      .sort()
      .map((id) => {
        const { width, height, extraSpacing } = sizeFor(nodesById[id]);
        return `${id}:${width}x${height}+${extraSpacing}`;
      })
      .join("|");
  }, [enabled, nodesById, sizeFor]);

  useEffect(() => {
    if (!enabled || externalLayout || !nodesById) return;

    const requestId = ++requestRef.current;

    computeDagLayout(nodesById, {
      direction,
      sizeFor: (node) => sizeForRef.current(node),
    })
      .then((layout) => {
        if (requestId !== requestRef.current) return;
        setComputed(layout);
      })
      .catch((error: unknown) => {
        if (requestId !== requestRef.current) return;
        if (onLayoutErrorRef.current) onLayoutErrorRef.current(error);
        else console.error("Flow: DAG layout failed", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, externalLayout, nodesById, direction, sizesKey]);

  return externalLayout ?? computed;
}

export default useDagLayout;
