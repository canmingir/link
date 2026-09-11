export type FlowVariant = "card" | "pill" | "n8n" | "simple";

/** The resolved style bag the node/edge renderers read from. Every field is
 * optional because it may come from the variant default, a per-node style
 * function, or a plugin; unknown extras are permitted. */
export interface FlowStyle {
  direction?: "vertical" | "horizontal";
  lineColor?: string;
  lineWidth?: string | number;
  lineStyle?: string;
  gap?: number;
  levelGap?: number;
  shape?: number | string;
  bg?: string;
  hoverBg?: string;
  borderColor?: string;
  borderWidth?: number;
  cardWidth?: number;
  minHeight?: number;
  shadowLevel?: number;
  selectionColor?: string;
  showDots?: boolean;
  dotRadius?: number;
  dotColor?: string;
  showArrow?: boolean;
  arrowSize?: number;
  animated?: boolean;
  animationSpeed?: number;
  gradient?: string | { from: string; to: string } | null;
  curvature?: number;
  connectorType?: string;
  startGap?: number;
  endGap?: number;
  label?: unknown;
  labelStyle?: Record<string, unknown>;
  labelPosition?: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
  nodeSx?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BaseVariantStyle extends FlowStyle {
  lineColor: string;
  lineWidth: string;
  lineStyle: string;
  gap: number;
  shape: number;
  bg: string;
  hoverBg: string;
  borderColor: string;
  selectionColor: string;
  showDots: boolean;
  showArrow: boolean;
  arrowSize: number;
  animated: boolean;
  animationSpeed: number;
  gradient: string | null;
  curvature: number;
  connectorType: string;
}

export const toPxNumber = (
  v: string | number | null | undefined,
  fallback = 1
): number => {
  if (v == null) return fallback;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : fallback;
};

export const getBaseStyleForVariant = (
  v: FlowVariant | string | undefined
): BaseVariantStyle => {
  switch (v) {
    case "card":
      return {
        lineColor: "#b1b1b7",
        lineWidth: "2px",
        lineStyle: "solid",
        gap: 56,
        shape: 10,
        bg: "background.paper",
        hoverBg: "grey.50",
        borderColor: "#e2e8f0",
        selectionColor: "#64748b",
        showDots: false,
        showArrow: true,
        arrowSize: 6,
        animated: false,
        animationSpeed: 1,
        gradient: null,
        curvature: 0.5,
        connectorType: "curved",
      };
    case "pill":
      return {
        lineColor: "#8b5cf6",
        lineWidth: "2px",
        lineStyle: "solid",
        gap: 48,
        shape: 9999,
        bg: "rgba(139, 92, 246, 0.08)",
        hoverBg: "rgba(139, 92, 246, 0.16)",
        borderColor: "#8b5cf6",
        selectionColor: "#8b5cf6",
        showDots: false,
        showArrow: true,
        arrowSize: 6,
        animated: false,
        animationSpeed: 1,
        gradient: null,
        curvature: 0.4,
        connectorType: "curved",
      };
    case "n8n":
      return {
        lineColor: "#b1b1b7",
        lineWidth: "2px",
        lineStyle: "solid",
        gap: 60,
        shape: 8,
        bg: "#ffffff",
        hoverBg: "#f8fafc",
        borderColor: "#e2e8f0",
        selectionColor: "#ff6d5a",
        showDots: false,
        showArrow: true,
        arrowSize: 6,
        animated: false,
        animationSpeed: 1,
        gradient: null,
        curvature: 0.5,
        connectorType: "curved",
      };
    case "simple":
    default:
      return {
        lineColor: "#b1b1b7",
        lineWidth: "2px",
        lineStyle: "solid",
        gap: 50,
        shape: 8,
        bg: "background.paper",
        hoverBg: "grey.50",
        borderColor: "#e2e8f0",
        selectionColor: "#64748b",
        showDots: false,
        showArrow: true,
        arrowSize: 6,
        animated: false,
        animationSpeed: 1,
        gradient: null,
        curvature: 0.5,
        connectorType: "curved",
      };
  }
};

type DecisionNodeType = "start" | "decision" | "process" | "end";

interface DecisionNodeStyle {
  bg: string;
  borderColor: string;
  shape: number;
}

export const getDecisionNodeStyle = (
  nodeType: DecisionNodeType | string
): DecisionNodeStyle => {
  const styles: Record<DecisionNodeType, DecisionNodeStyle> = {
    start: { bg: "#E8F5E9", borderColor: "#4CAF50", shape: 8 },
    decision: { bg: "#FFF3E0", borderColor: "#FF9800", shape: 24 },
    process: { bg: "#E3F2FD", borderColor: "#2196F3", shape: 8 },
    end: { bg: "#FFEBEE", borderColor: "#F44336", shape: 8 },
  };
  return styles[nodeType as DecisionNodeType] || styles.process;
};

/** Loosely-typed style bag consumed by the node renderers; callers pass a
 * subset of these keys plus arbitrary extras. */
export type SemanticStyleInput = Record<string, unknown> & {
  border?: unknown;
  borderWidth?: unknown;
  borderColor?: unknown;
  lineWidth?: unknown;
  size?: unknown;
  cardWidth?: unknown;
  gap?: unknown;
  shape?: unknown;
  minHeight?: unknown;
  shadow?: unknown;
  shadowLevel?: unknown;
};

export const applySemanticTokens = (
  styleObj: SemanticStyleInput,
  base: Partial<BaseVariantStyle>
): Record<string, unknown> => {
  const s: Record<string, unknown> = { ...styleObj };

  const border = typeof s.border === "string" ? s.border : null;
  const borderWeightMap: Record<string, number> = {
    light: 1,
    normal: 3,
    bold: 5,
  };
  if (border && ["light", "normal", "bold"].includes(border)) {
    const w = borderWeightMap[border];
    if (s.borderWidth == null) s.borderWidth = w;
    if (s.lineWidth == null) s.lineWidth = `${w}px`;
    if (!s.borderColor)
      s.borderColor = base.borderColor || base.lineColor || "#E0E0E0";
  } else if (border && (border.startsWith("#") || border.startsWith("rgb"))) {
    s.borderColor = border;
  }

  const sizeMap: Record<string, { cardWidth: number; gap: number }> = {
    small: { cardWidth: 140, gap: 20 },
    medium: { cardWidth: 180, gap: 30 },
    large: { cardWidth: 220, gap: 40 },
  };
  const size = typeof s.size === "string" ? s.size : null;
  if (size && sizeMap[size]) {
    const { cardWidth, gap } = sizeMap[size];
    if (s.cardWidth == null) s.cardWidth = cardWidth;
    if (s.gap == null) s.gap = gap;
  }

  const cardWidth = typeof s.cardWidth === "number" ? s.cardWidth : null;
  const minHeight = typeof s.minHeight === "number" ? s.minHeight : null;

  if (s.shape === "square") {
    const defaultSize = 140;
    if (cardWidth != null && minHeight == null) s.minHeight = cardWidth;
    else if (minHeight != null && cardWidth == null) s.cardWidth = minHeight;
    else if (cardWidth == null && minHeight == null) {
      s.cardWidth = defaultSize;
      s.minHeight = defaultSize;
    }
  }

  if (s.shape === "vertical") {
    const defaultWidth = 160;
    if (cardWidth == null) s.cardWidth = defaultWidth;
    if (minHeight == null)
      s.minHeight = Math.max((cardWidth ?? defaultWidth) * 1.3, 110);
  }

  const shadowVariantMap: Record<string, number> = {
    none: 0,
    soft: 2,
    heavy: 6,
  };
  const shadow = typeof s.shadow === "string" ? s.shadow : null;
  if (shadow && shadowVariantMap[shadow] != null && s.shadowLevel == null) {
    s.shadowLevel = shadowVariantMap[shadow];
  }

  return s;
};
