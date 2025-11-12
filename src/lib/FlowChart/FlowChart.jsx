import NodeBox from "./NodeBox";
import React from "react";

import { Box, Card, Typography } from "@mui/material";

export const FlowChart = ({
  type = "default",
  data,
  variant = "simple",
  style,
}) => {
  const hasChildren = Array.isArray(data.children) && data.children.length > 0;

  const getBaseStyleForVariant = (v) => {
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

  const getDecisionNodeStyle = (nodeType) => {
    const styles = {
      start: { bg: "#E8F5E9", borderColor: "#4CAF50", shape: 8 },
      decision: { bg: "#FFF3E0", borderColor: "#FF9800", shape: 24 },
      process: { bg: "#E3F2FD", borderColor: "#2196F3", shape: 8 },
      end: { bg: "#FFEBEE", borderColor: "#F44336", shape: 8 },
    };
    return styles[nodeType] || styles.process;
  };

  const baseStyle = getBaseStyleForVariant(variant);

  const resolveStyle = (node) => {
    let merged = { ...baseStyle };

    if (variant === "decision") {
      merged = {
        ...merged,
        ...getDecisionNodeStyle(node.type),
      };
    }

    if (typeof style === "function") {
      const user = style(node) || {};
      merged = { ...merged, ...user };
    } else if (style && typeof style === "object") {
      merged = { ...merged, ...style };
    }

    return merged;
  };

  const applySemanticTokens = (styleObj, base) => {
    const s = { ...styleObj };

    const borderWeightMap = {
      light: 1,
      normal: 3,
      bold: 5,
    };

    if (
      typeof s.border === "string" &&
      ["light", "normal", "bold"].includes(s.border)
    ) {
      const w = borderWeightMap[s.border];

      if (s.borderWidth == null) {
        s.borderWidth = w;
      }
      if (s.lineWidth == null) {
        s.lineWidth = `${w}px`;
      }
      if (!s.borderColor) {
        s.borderColor = base.borderColor || base.lineColor || "#E0E0E0";
      }
    } else if (
      typeof s.border === "string" &&
      (s.border.startsWith("#") || s.border.startsWith("rgb"))
    ) {
      s.borderColor = s.border;
    }

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

    if (s.shape === "square") {
      const defaultSize = 140;

      if (s.cardWidth != null && s.minHeight == null) {
        s.minHeight = s.cardWidth;
      } else if (s.minHeight != null && s.cardWidth == null) {
        s.cardWidth = s.minHeight;
      } else if (s.cardWidth == null && s.minHeight == null) {
        s.cardWidth = defaultSize;
        s.minHeight = defaultSize;
      }

      if (s.shape == null) {
        s.shape = 4;
      }
    }

    if (s.shape === "vertical") {
      const defaultWidth = 160;

      if (s.cardWidth == null) {
        s.cardWidth = defaultWidth;
      }
      if (s.minHeight == null) {
        s.minHeight = Math.max(s.cardWidth * 1.3, 110);
      }

      if (s.shape == null) {
        s.shape = 8;
      }
    }

    const shadowVariantMap = {
      none: 0,
      soft: 2,
      heavy: 6,
    };

    if (
      s.shadow &&
      shadowVariantMap[s.shadowVariant] != null &&
      s.shadowLevel == null
    ) {
      s.shadowLevel = shadowVariantMap[s.shadowVariant];
    }

    return s;
  };

  const rawNodeStyle = resolveStyle(data);
  const nodeStyle = applySemanticTokens(rawNodeStyle, baseStyle);

  const {
    lineColor = baseStyle.lineColor,
    lineWidth = baseStyle.lineWidth,
    lineStyle = baseStyle.lineStyle,
    gap = baseStyle.gap,
    visible = true,
    delay = 0,
    isLoading = false,
    nodeSx = {},
    borderWidth,
    borderColor = baseStyle.borderColor,
    cardWidth,
    shape,
    shadowLevel,
    minHeight,
  } = nodeStyle;

  const renderNodeContent = (node) => {
    const entries = Object.entries(node).filter(
      ([key]) => key !== "children" && key !== "id"
    );

    if (entries.length === 0) {
      return (
        <Typography variant="body2" sx={{ fontSize: 12, textAlign: "center" }}>
          (empty)
        </Typography>
      );
    }

    const preferredTitleKeys = ["label", "title", "name"];
    const titleEntry =
      entries.find(([key]) => preferredTitleKeys.includes(key)) || entries[0];

    const [titleKey, titleValRaw] = titleEntry;
    const titleVal = String(titleValRaw);

    let remaining = entries.filter(([key]) => key !== titleKey);

    const preferredSubtitleKeys = ["description", "role", "type", "status"];
    const subtitleEntry =
      remaining.find(([key]) => preferredSubtitleKeys.includes(key)) || null;

    let subtitleVal = null;
    if (subtitleEntry) {
      const [subtitleKey, raw] = subtitleEntry;
      subtitleVal = String(raw);
      remaining = remaining.filter(([key]) => key !== subtitleKey);
    }

    const metaEntries = remaining.filter(([, value]) => {
      const t = typeof value;
      return (
        (t === "string" || t === "number" || t === "boolean") &&
        value !== "" &&
        value !== null
      );
    });

    return (
      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 13,
            mb: subtitleVal ? 0.5 : 0,
          }}
        >
          {titleVal}
        </Typography>

        {subtitleVal && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontSize: 11,
              mb: metaEntries.length ? 0.5 : 0,
            }}
          >
            {subtitleVal}
          </Typography>
        )}

        {metaEntries.length > 0 && (
          <Box sx={{ mt: 0.25 }}>
            {metaEntries.map(([key, value]) => (
              <Typography
                key={key}
                variant="caption"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  display: "block",
                  fontSize: 10,
                }}
              >
                {key}: {String(value)}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const renderCard = () => {
    const effectiveWidth = cardWidth || 220;
    const effectiveBorderWidth = borderWidth || 1;
    const effectiveRadius =
      typeof shape === "number" ? shape : baseStyle.shape || 4;
    const effectiveShadow =
      typeof shadowLevel === "number"
        ? shadowLevel
        : variant === "card"
        ? 2
        : 1;
    const effectiveMinHeight = minHeight || 80;

    return (
      <Card
        sx={{
          p: 2,
          width: effectiveWidth,
          minHeight: effectiveMinHeight,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          borderRadius: effectiveRadius,
          bgcolor: nodeStyle.bg || "background.paper",
          border: `${effectiveBorderWidth}px solid ${
            borderColor || "transparent"
          }`,
          boxShadow: effectiveShadow,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            bgcolor: nodeStyle.hoverBg || nodeStyle.bg || "grey.100",
            boxShadow: effectiveShadow + 1,
            cursor: "pointer",
          },
          ...nodeSx,
        }}
      >
        {renderNodeContent(data)}
      </Card>
    );
  };

  const isTask = type === "task";

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {isTask ? (
          <NodeBox
            nodeData={data}
            visible={visible}
            delay={delay}
            isLoading={isLoading}
          />
        ) : (
          renderCard()
        )}

        {hasChildren && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "100%",
              width: lineWidth || `${borderWidth || 1}px`,
              height: 20,
              transform: "translateX(-50%)",
              backgroundColor:
                lineStyle === "solid" ? lineColor : "transparent",
              borderLeft:
                lineStyle !== "solid"
                  ? `${
                      lineWidth || `${borderWidth || 1}px`
                    } ${lineStyle} ${lineColor}`
                  : "none",
            }}
          />
        )}
      </Box>

      {hasChildren && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap,
            marginTop: 2.5,
            position: "relative",
          }}
        >
          {data.children && data.children.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: lineWidth || `${borderWidth || 1}px`,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: lineWidth || `${borderWidth || 1}px`,
                  backgroundColor:
                    lineStyle === "solid" ? lineColor : "transparent",
                  borderTop:
                    lineStyle !== "solid"
                      ? `${
                          lineWidth || `${borderWidth || 1}px`
                        } ${lineStyle} ${lineColor}`
                      : "none",
                },
              }}
            />
          )}

          {data.children?.map((child) => (
            <Box
              key={child.id}
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: "100%",
                  width: lineWidth || `${borderWidth || 1}px`,
                  height: 20,
                  backgroundColor:
                    lineStyle === "solid" ? lineColor : "transparent",
                  borderLeft:
                    lineStyle !== "solid"
                      ? `${
                          lineWidth || `${borderWidth || 1}px`
                        } ${lineStyle} ${lineColor}`
                      : "none",
                  transform: "translateX(-50%)",
                }}
              />

              <FlowChart
                data={child}
                style={style}
                type={type}
                variant={variant}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FlowChart;
