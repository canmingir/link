import DraggableNode from "./DraggableNode";
import DynamicConnector from "./DynamicConnector";
import { getContentParts } from "./flowUtils";

import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  applySemanticTokens,
  getBaseStyleForVariant,
  getDecisionNodeStyle,
  toPxNumber,
} from "./styles";

const NodeContent = ({
  node,
  type,
  variant,
  style,
  plugin,
  registerRef,
  onDrag,
}) => {
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

  let _plugin = null;
  if (plugin) {
    if (typeof plugin === "function") {
      _plugin = plugin(type, node) || null;
    } else if (typeof plugin === "object") {
      _plugin = plugin;
    }
  }

  let pluginTokens = {};
  if (_plugin && typeof _plugin.style === "function") {
    pluginTokens =
      _plugin.style({
        node,
        style: styleTokens,
      }) || {};
  }

  const rawNodeStyle = {
    ...baseStyle,
    ...variantTokens,
    ...styleTokens,
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

  const handleDrag = (newOffset) => {
    setConnectorTick((t) => t + 1);
    if (onDrag) onDrag(newOffset);
  };

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
    if (_plugin && typeof _plugin.node === "function") {
      return _plugin.node({
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
      <DraggableNode
        registerRef={(el) => {
          parentRef.current = el;
          if (registerRef) registerRef(el);
        }}
        onDrag={handleDrag}
      >
        {renderContent()}
      </DraggableNode>

      {hasChildren && (
        <>
          <DynamicConnector
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
              <FlowNode
                key={child.id}
                node={child}
                type={type}
                variant={variant}
                style={style}
                plugin={plugin}
                registerRef={(el) => (childRefs.current[child.id] = el)}
                onDrag={() => setConnectorTick((t) => t + 1)}
                isRoot={false}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

const FlowNode = ({ isRoot = false, ...props }) => {
  if (!isRoot) {
    return <NodeContent {...props} />;
  }

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const [zoom, setZoom] = useState(1);

  const clampZoom = (z) => Math.min(2.5, Math.max(0.25, z));

  useEffect(() => {
    const onWheel = (e) => {
      const wantsZoom = e.ctrlKey || e.metaKey;
      if (!wantsZoom) return;

      e.preventDefault();

      const direction = e.deltaY > 0 ? -1 : 1;
      const factor = direction > 0 ? 1.1 : 1 / 1.1;

      setZoom((z) => clampZoom(z * factor));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const handleCanvasMouseDown = (e) => {
    if (e.target?.closest?.('[data-flow-zoom="true"]')) return;

    if (e.button !== 0) return;

    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startOffset = { ...offset };

    const onMove = (ev) => {
      setOffset({
        x: startOffset.x + (ev.clientX - startX),
        y: startOffset.y + (ev.clientY - startY),
      });
    };

    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <Box
      onMouseDown={handleCanvasMouseDown}
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "none",
        cursor: isDragging ? "grabbing" : "default",
        userSelect: "none",
        position: "relative",
      }}
    >
      <Box
        sx={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          pointerEvents: "auto",
        }}
      >
        <NodeContent {...props} />
      </Box>
    </Box>
  );
};

export default FlowNode;
