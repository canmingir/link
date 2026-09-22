import { useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  computeDagLayout,
} from "../utils/dagLayout";
import { getBaseStyleForVariant, toPxNumber } from "../styles";

function resolveTokens({ node, type, variant, style, plugin }) {
  const baseStyle = getBaseStyleForVariant(variant);

  let tokens = {};
  if (typeof style === "function") {
    tokens = style(node) || {};
  } else if (style && typeof style === "object") {
    tokens = style;
  }

  let resolvedPlugin = null;
  if (plugin) {
    resolvedPlugin =
      typeof plugin === "function" ? plugin(type, node) || null : plugin;
  }

  let pluginTokens = {};
  if (resolvedPlugin && typeof resolvedPlugin.style === "function") {
    pluginTokens = resolvedPlugin.style({ node, style: tokens }) || {};
  }

  return { ...baseStyle, ...tokens, ...pluginTokens };
}

function sizeFromTokens(tokens) {
  const width =
    tokens.nodeWidth ?? tokens.maxWidth ?? tokens.minWidth ?? tokens.cardWidth;
  const height = tokens.nodeHeight ?? tokens.maxHeight ?? tokens.minHeight;

  return {
    width: toPxNumber(width, DEFAULT_NODE_WIDTH),
    height: toPxNumber(height, DEFAULT_NODE_HEIGHT),
  };
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
}) {
  const [computed, setComputed] = useState(null);
  const requestRef = useRef(0);

  const externalLayout = useMemo(
    () =>
      positions
        ? { positions, edges: layoutEdges ?? [], bounds: layoutBounds }
        : null,
    [positions, layoutEdges, layoutBounds]
  );

  const sizeFor = useMemo(() => {
    return (node) =>
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
        const { width, height } = sizeFor(nodesById[id]);
        return `${id}:${width}x${height}`;
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
      .catch((error) => {
        if (requestId !== requestRef.current) return;
        if (onLayoutErrorRef.current) onLayoutErrorRef.current(error);
        else console.error("Flow: DAG layout failed", error);
      });
  }, [enabled, externalLayout, nodesById, direction, sizesKey]);

  return externalLayout ?? computed;
}

export default useDagLayout;
