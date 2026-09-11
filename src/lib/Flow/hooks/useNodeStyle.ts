import type { FlowNode } from "../types";
import type React from "react";
import { useMemo } from "react";

import type { BaseVariantStyle, FlowStyle } from "../styles";
import {
  applySemanticTokens,
  getBaseStyleForVariant,
  getDecisionNodeStyle,
} from "../styles";

type StyleArg = FlowNode & { type?: string; virtual?: boolean };

export type FlowStyleResolver = ((node: StyleArg) => FlowStyle) | FlowStyle;

/** A node/edge rendering plugin. Its hooks receive a loosely-shaped bag
 * (node, optional child, current style) and return partial style overrides;
 * `node` may also return a rendered element. */
export interface FlowStylePlugin {
  style?: (args: Record<string, unknown>) => FlowStyle | null | undefined;
  edge?: (args: Record<string, unknown>) => FlowStyle | null | undefined;
  node?: (args: Record<string, unknown>) => React.ReactNode;
}

export type FlowPluginArg =
  | ((type: string | undefined, node: StyleArg) => FlowStylePlugin | null)
  | FlowStylePlugin;

export interface UseNodeStyleArgs {
  node: StyleArg;
  type?: string;
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
}

export interface NodeStyleResult {
  baseStyle: BaseVariantStyle;
  nodeStyle: FlowStyle;
  edgeStyle: FlowStyle;
  plugin: FlowStylePlugin | null;
}

export const useNodeStyle = ({
  node,
  type,
  variant,
  style,
  plugin,
}: UseNodeStyleArgs): NodeStyleResult => {
  return useMemo(() => {
    const baseStyle = getBaseStyleForVariant(variant);

    const variantTokens: FlowStyle =
      variant === "decision"
        ? { ...getDecisionNodeStyle(node?.type ?? "process") }
        : {};

    let styleTokens: FlowStyle = {};
    if (typeof style === "function") {
      styleTokens = style(node) || {};
    } else if (style && typeof style === "object") {
      styleTokens = style;
    }

    let resolvedPlugin: FlowStylePlugin | null = null;
    if (plugin) {
      if (typeof plugin === "function") {
        resolvedPlugin = plugin(type, node) || null;
      } else if (typeof plugin === "object") {
        resolvedPlugin = plugin;
      }
    }

    let pluginTokens: FlowStyle = {};
    if (resolvedPlugin && typeof resolvedPlugin.style === "function") {
      pluginTokens =
        resolvedPlugin.style({
          node,
          style: styleTokens,
        }) || {};
    }

    let pluginEdgeTokens: FlowStyle = {};
    if (resolvedPlugin && typeof resolvedPlugin.edge === "function") {
      pluginEdgeTokens =
        resolvedPlugin.edge({
          node,
          style: styleTokens,
        }) || {};
    }

    const rawNodeStyle: FlowStyle = {
      ...baseStyle,
      ...variantTokens,
      ...styleTokens,
      ...pluginTokens,
    };

    const nodeStyle = applySemanticTokens(rawNodeStyle, baseStyle) as FlowStyle;

    const edgeStyle: FlowStyle = {
      ...pluginEdgeTokens,
    };

    return {
      baseStyle,
      nodeStyle,
      edgeStyle,
      plugin: resolvedPlugin,
    };
  }, [node, type, variant, style, plugin]);
};
