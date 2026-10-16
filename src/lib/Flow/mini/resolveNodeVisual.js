import { getDecisionNodeStyle } from "../styles";

export function resolveNodeVisual({ node, type, variant, style, plugin }) {
  const variantTokens =
    variant === "decision" ? getDecisionNodeStyle(node?.type) : {};

  let styleTokens = {};
  if (typeof style === "function") {
    styleTokens = style(node) || {};
  } else if (style && typeof style === "object") {
    styleTokens = style;
  }

  let resolvedPlugin = null;
  if (plugin) {
    if (typeof plugin === "function") {
      resolvedPlugin = plugin(type, node) || null;
    } else if (typeof plugin === "object") {
      resolvedPlugin = plugin;
    }
  }

  let pluginTokens = {};
  if (resolvedPlugin && typeof resolvedPlugin.style === "function") {
    pluginTokens = resolvedPlugin.style({ node, style: styleTokens }) || {};
  }

  const merged = {
    ...variantTokens,
    ...styleTokens,
    ...pluginTokens,
  };

  const gradientStops =
    merged.gradient && typeof merged.gradient === "object"
      ? merged.gradient
      : null;
  const fill =
    (typeof merged.gradient === "string" ? merged.gradient : null) ||
    merged.bg ||
    null;
  let stroke = merged.borderColor || null;
  if (
    typeof merged.border === "string" &&
    (merged.border.startsWith("#") || merged.border.startsWith("rgb"))
  ) {
    stroke = merged.border;
  }

  return { fill, stroke, gradientStops };
}
