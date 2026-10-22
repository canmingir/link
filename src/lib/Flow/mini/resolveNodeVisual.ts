import { getDecisionNodeStyle } from "../styles";

type StyleTokens = Record<string, unknown>;

/** A minimal node the visual resolver reads: an id, an optional semantic
 * `type`, plus arbitrary domain fields. */
export interface ResolvableNode {
  id: string;
  type?: string;
  [key: string]: unknown;
}

interface StylePlugin {
  style?: (args: { node: ResolvableNode; style: StyleTokens }) => StyleTokens;
}

export interface ResolveNodeVisualArgs {
  node?: ResolvableNode;
  type?: string;
  variant?: string;
  style?: ((node: ResolvableNode | undefined) => StyleTokens) | StyleTokens;
  plugin?:
    | ((
        type: string | undefined,
        node: ResolvableNode | undefined
      ) => StylePlugin)
    | StylePlugin;
}

export interface NodeVisual {
  fill: string | null;
  stroke: string | null;
  gradientStops: StyleTokens | null;
}

export function resolveNodeVisual({
  node,
  type,
  variant,
  style,
  plugin,
}: ResolveNodeVisualArgs): NodeVisual {
  const variantTokens: StyleTokens =
    variant === "decision"
      ? { ...getDecisionNodeStyle(node?.type ?? "process") }
      : {};

  let styleTokens: StyleTokens = {};
  if (typeof style === "function") {
    styleTokens = style(node) || {};
  } else if (style && typeof style === "object") {
    styleTokens = style;
  }

  let resolvedPlugin: StylePlugin | null = null;
  if (plugin) {
    if (typeof plugin === "function") {
      resolvedPlugin = plugin(type, node) || null;
    } else if (typeof plugin === "object") {
      resolvedPlugin = plugin;
    }
  }

  let pluginTokens: StyleTokens = {};
  if (resolvedPlugin && typeof resolvedPlugin.style === "function") {
    pluginTokens =
      resolvedPlugin.style({
        node: node as ResolvableNode,
        style: styleTokens,
      }) || {};
  }

  const merged: StyleTokens = {
    ...variantTokens,
    ...styleTokens,
    ...pluginTokens,
  };

  const gradientStops =
    merged.gradient && typeof merged.gradient === "object"
      ? (merged.gradient as StyleTokens)
      : null;
  const fill =
    (typeof merged.gradient === "string" ? merged.gradient : null) ||
    (typeof merged.bg === "string" ? merged.bg : null) ||
    null;
  let stroke =
    typeof merged.borderColor === "string" ? merged.borderColor : null;
  if (
    typeof merged.border === "string" &&
    (merged.border.startsWith("#") || merged.border.startsWith("rgb"))
  ) {
    stroke = merged.border;
  }

  return { fill, stroke, gradientStops };
}
