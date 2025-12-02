import ConnectorSVG from "./ConnectorSvg";
import DraggableNode from "./DraggableNode";
import { getContentParts } from "./shared";

import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  applySemanticTokens,
  getBaseStyleForVariant,
  getDecisionNodeStyle,
  toPxNumber,
} from "./styles";

const FlowNode = ({ node, type, variant, style, pluginResolver }) => {
  const baseStyle = getBaseStyleForVariant(variant);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  const variantTokens =
    variant === "decision" ? getDecisionNodeStyle(node.type) : {};

  let styleTokens = {};
  if (typeof style === "function") {
    styleTokens = style(node) || {};
  } else if (style && typeof style === "object") {
    styleTokens = style;
  }

  let plugin = null;
  if (pluginResolver) {
    if (typeof pluginResolver === "function") {
      plugin = pluginResolver(type, node);
    } else if (
      typeof pluginResolver === "object" &&
      (typeof pluginResolver.renderNode === "function" ||
        typeof pluginResolver.resolveStyle === "function")
    ) {
      plugin = pluginResolver;
    }
  }

  const mergedStyleForPlugin = {
    ...baseStyle,
    ...variantTokens,
    ...styleTokens,
  };

  let pluginTokens = {};
  if (plugin && typeof plugin.resolveStyle === "function") {
    pluginTokens =
      plugin.resolveStyle({
        node,
        baseStyle,
        mergedStyle: mergedStyleForPlugin,
      }) || {};
  }

  const rawNodeStyle = {
    ...mergedStyleForPlugin,
    ...pluginTokens,
  };

  const nodeStyle = applySemanticTokens(rawNodeStyle, baseStyle);

  const {
    lineColor = baseStyle.lineColor,
    lineWidth = baseStyle.lineWidth,
    lineStyle = baseStyle.lineStyle,
    gap = baseStyle.gap,
    levelGap = baseStyle.levelGap ?? 2.5,
    nodeSx = {},
    borderWidth,
    borderColor = baseStyle.borderColor,
    cardWidth,
    shape,
    shadowLevel,
    minHeight,
    connectorType = baseStyle.connectorType ?? "default",
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

  const { title, subtitle, metaEntries } = getContentParts(node);

  const renderDefaultCard = () => {
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
        <Box sx={{ textAlign: "left", width: "100%" }}>
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              fontSize: 13,
              mb: subtitle ? 0.5 : 0,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: "center",
                fontSize: 11,
                mb: metaEntries.length ? 0.5 : 0,
              }}
            >
              {subtitle}
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
      </Card>
    );
  };

  const renderContent = () => {
    if (plugin && typeof plugin.renderNode === "function") {
      return plugin.renderNode({
        node,
        title,
        subtitle,
        metaEntries,
        nodeStyle,
        baseStyle,
      });
    }
    return renderDefaultCard();
  };

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
        {renderContent()}
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
                  pluginResolver={pluginResolver}
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
