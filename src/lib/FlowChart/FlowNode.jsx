import ConnectorSVG from "./ConnectorSvg";
import DraggableNode from "./DraggableNode";
import NodeBox from "./NodeBox";

import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  applySemanticTokens,
  getBaseStyleForVariant,
  getDecisionNodeStyle,
  toPxNumber,
} from "./styles";

const FlowNode = ({ node, type, variant, style }) => {
  const baseStyle = getBaseStyleForVariant(variant);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  const resolveStyle = (n) => {
    let merged = { ...baseStyle };
    if (variant === "decision")
      merged = { ...merged, ...getDecisionNodeStyle(n.type) };
    if (typeof style === "function")
      merged = { ...merged, ...(style(n) || {}) };
    else if (style && typeof style === "object")
      merged = { ...merged, ...style };
    return merged;
  };

  const rawNodeStyle = resolveStyle(node);
  const nodeStyle = applySemanticTokens(rawNodeStyle, baseStyle);

  const {
    lineColor = baseStyle.lineColor,
    lineWidth = baseStyle.lineWidth,
    lineStyle = baseStyle.lineStyle,
    gap = baseStyle.gap,
    levelGap = baseStyle.levelGap ?? 2.5,
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
    connectorType = "default",
  } = nodeStyle;

  const strokeWidth = toPxNumber(lineWidth, 1.5);
  const dashStyle =
    lineStyle === "dashed" || lineStyle === "dotted" ? lineStyle : "solid";

  const containerRef = useRef(null);
  const parentRef = useRef(null);
  const childRefs = useRef({});
  const [childElList, setChildElList] = useState([]);

  const [connectorTick, setConnectorTick] = useState(0);
  const notifyDrag = () => setConnectorTick((t) => t + 1);

  useLayoutEffect(() => {
    const els = (node.children || [])
      .map((c) => childRefs.current[c.id])
      .filter(Boolean);
    setChildElList(els);
  }, [node.children]);

  useEffect(() => {
    const t = setTimeout(() => {
      const els = (node.children || [])
        .map((c) => childRefs.current[c.id])
        .filter(Boolean);
      setChildElList(els);
    }, 0);
    return () => clearTimeout(t);
  }, [node.children]);

  const renderNodeContent = (n) => {
    const entries = Object.entries(n).filter(
      ([key]) =>
        key !== "children" &&
        key !== "id" &&
        key !== "previous" &&
        key !== "next"
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          position: "relative",
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
        {renderNodeContent(node)}
      </Card>
    );
  };

  const isTask = type === "task";

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box ref={parentRef} sx={{ position: "relative" }}>
        {isTask ? (
          <NodeBox
            nodeData={node}
            visible={visible}
            delay={delay}
            isLoading={isLoading}
          />
        ) : (
          renderCard()
        )}
      </Box>

      {hasChildren && (
        <>
          <ConnectorSVG
            containerEl={containerRef.current}
            parentEl={parentRef.current}
            childEls={childElList}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            lineStyle={dashStyle}
            connectorType={connectorType}
            tick={connectorTick}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              columnGap: gap,
              marginTop: levelGap,
              position: "relative",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {node.children.map((child) => (
              <DraggableNode
                key={child.id}
                registerRef={(el) => (childRefs.current[child.id] = el)}
                onDrag={notifyDrag}
              >
                <FlowNode
                  node={child}
                  type={type}
                  variant={variant}
                  style={style}
                />
              </DraggableNode>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default FlowNode;
