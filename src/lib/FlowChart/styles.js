export const toPxNumber = (v, fallback = 1) => {
  if (v == null) return fallback;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : fallback;
};

export const getBaseStyleForVariant = (v) => {
  switch (v) {
    case "card":
      return {
        lineColor: "#BDBDBD",
        lineWidth: "2px",
        lineStyle: "solid",
        gap: 56,
        shape: 8,
        bg: "background.paper",
        hoverBg: "grey.100",
        borderColor: "#9E9E9E",
      };
    case "pill":
      return {
        lineColor: "#9C27B0",
        lineWidth: "2px",
        lineStyle: "dashed",
        gap: 48,
        shape: 9999,
        bg: "rgba(156, 39, 176, 0.08)",
        hoverBg: "rgba(156, 39, 176, 0.16)",
        borderColor: "#9C27B0",
      };
    case "decision":
      return {
        lineColor: "#757575",
        lineWidth: "2px",
        lineStyle: "dashed",
        gap: 60,
        shape: 8,
        bg: "background.paper",
        hoverBg: "grey.100",
        borderColor: "#757575",
      };
    case "simple":
    default:
      return {
        lineColor: "#E0E0E0",
        lineWidth: "1.5px",
        lineStyle: "solid",
        gap: 40,
        shape: 4,
        bg: "background.default",
        hoverBg: "grey.100",
        borderColor: "#E0E0E0",
      };
  }
};

export const getDecisionNodeStyle = (nodeType) => {
  const styles = {
    start: { bg: "#E8F5E9", borderColor: "#4CAF50", shape: 8 },
    decision: { bg: "#FFF3E0", borderColor: "#FF9800", shape: 24 },
    process: { bg: "#E3F2FD", borderColor: "#2196F3", shape: 8 },
    end: { bg: "#FFEBEE", borderColor: "#F44336", shape: 8 },
  };
  return styles[nodeType] || styles.process;
};

export const applySemanticTokens = (styleObj, base) => {
  const s = { ...styleObj };

  const borderWeightMap = { light: 1, normal: 3, bold: 5 };
  if (
    typeof s.border === "string" &&
    ["light", "normal", "bold"].includes(s.border)
  ) {
    const w = borderWeightMap[s.border];
    if (s.borderWidth == null) s.borderWidth = w;
    if (s.lineWidth == null) s.lineWidth = `${w}px`;
    if (!s.borderColor)
      s.borderColor = base.borderColor || base.lineColor || "#E0E0E0";
  } else if (
    typeof s.border === "string" &&
    (s.border.startsWith("#") || s.border.startsWith("rgb"))
  ) {
    s.borderColor = s.border;
  }

  // size: small | medium | large
  const sizeMap = {
    small: { cardWidth: 140, gap: 20 },
    medium: { cardWidth: 180, gap: 30 },
    large: { cardWidth: 220, gap: 40 },
  };
  if (s.size && sizeMap[s.size]) {
    const { cardWidth, gap } = sizeMap[s.size];
    if (s.cardWidth == null) s.cardWidth = cardWidth;
    if (s.gap == null) s.gap = gap;
  }

  // shape: "square" | "vertical" (affects dimensions)
  if (s.shape === "square") {
    const defaultSize = 140;
    if (s.cardWidth != null && s.minHeight == null) s.minHeight = s.cardWidth;
    else if (s.minHeight != null && s.cardWidth == null)
      s.cardWidth = s.minHeight;
    else if (s.cardWidth == null && s.minHeight == null) {
      s.cardWidth = defaultSize;
      s.minHeight = defaultSize;
    }
  }

  if (s.shape === "vertical") {
    const defaultWidth = 160;
    if (s.cardWidth == null) s.cardWidth = defaultWidth;
    if (s.minHeight == null) s.minHeight = Math.max(s.cardWidth * 1.3, 110);
  }

  // shadow: "none" | "soft" | "heavy"
  const shadowVariantMap = { none: 0, soft: 2, heavy: 6 };
  if (s.shadow && shadowVariantMap[s.shadow] != null && s.shadowLevel == null) {
    s.shadowLevel = shadowVariantMap[s.shadow];
  }

  return s;
};
