import DraggableNode from "./DraggableNode";
import DynamicConnector from "./DynamicConnector";
import { getContentParts } from "./flowUtils";

import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SelectionProvider, useSelection } from "./SelectionContext";
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
    direction = "vertical",
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
    showDots = baseStyle.showDots ?? false,
    dotRadius = baseStyle.dotRadius ?? 4,
    dotColor = baseStyle.dotColor,
    showArrow = baseStyle.showArrow ?? true,
    arrowSize = baseStyle.arrowSize ?? 6,
    animated = baseStyle.animated ?? false,
    animationSpeed = baseStyle.animationSpeed ?? 1,
    gradient = baseStyle.gradient ?? null,
    curvature = baseStyle.curvature ?? 0.5,
    selectionColor = baseStyle.selectionColor ?? "#64748b",
  } = nodeStyle;

  const isHorizontal = direction === "horizontal";

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
        flexDirection: isHorizontal ? "row" : "column",
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
        nodeId={node.id}
        selectionColor={selectionColor}
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
            tick={connectorTick}
            orientation={direction}
            showDots={showDots}
            dotRadius={dotRadius}
            dotColor={dotColor}
            showArrow={showArrow}
            arrowSize={arrowSize}
            animated={animated}
            animationSpeed={animationSpeed}
            gradient={gradient}
            curvature={curvature}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: isHorizontal ? "column" : "row",
              ...(isHorizontal
                ? {
                    marginLeft: levelGap,
                    rowGap: gap,
                  }
                : {
                    marginTop: levelGap,
                    columnGap: gap,
                  }),
              position: "relative",
              alignItems: isHorizontal ? "flex-start" : "flex-start",
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

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const SelectionBox = ({ box, selectionColor = "#64748b" }) => {
  if (!box) return null;

  const { startX, startY, currentX, currentY } = box;
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  return (
    <Box
      sx={{
        position: "fixed",
        left,
        top,
        width,
        height,
        border: `2px solid ${selectionColor}`,
        backgroundColor: hexToRgba(selectionColor, 0.1),
        pointerEvents: "none",
        zIndex: 9999,
        borderRadius: "4px",
      }}
    />
  );
};

const FlowCanvas = ({ children, selectionColor = "#64748b" }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectionBox, setSelectionBox] = useState(null);
  const containerRef = useRef(null);
  const selectionBoxRef = useRef(null);

  const { clearSelection, selectMultiple, addToSelection } = useSelection();

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
    if (e.target?.closest?.(".MuiCard-root") || e.target?.closest?.("button"))
      return;

    if (e.button !== 0) return;

    const startX = e.clientX;
    const startY = e.clientY;

    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      setSelectionBox({ startX, startY, currentX: startX, currentY: startY });
      selectionBoxRef.current = {
        startX,
        startY,
        currentX: startX,
        currentY: startY,
      };

      const onMove = (ev) => {
        const newBox = {
          startX,
          startY,
          currentX: ev.clientX,
          currentY: ev.clientY,
        };
        setSelectionBox(newBox);
        selectionBoxRef.current = newBox;
      };

      const onUp = () => {
        if (containerRef.current && selectionBoxRef.current) {
          const box = selectionBoxRef.current;
          const nodes = containerRef.current.querySelectorAll("[data-node-id]");
          const selectedNodeIds = [];

          const boxLeft = Math.min(box.startX, box.currentX);
          const boxRight = Math.max(box.startX, box.currentX);
          const boxTop = Math.min(box.startY, box.currentY);
          const boxBottom = Math.max(box.startY, box.currentY);

          nodes.forEach((node) => {
            const rect = node.getBoundingClientRect();

            if (
              rect.left < boxRight &&
              rect.right > boxLeft &&
              rect.top < boxBottom &&
              rect.bottom > boxTop
            ) {
              const nodeId = node.getAttribute("data-node-id");
              if (nodeId) selectedNodeIds.push(nodeId);
            }
          });

          if (selectedNodeIds.length > 0) {
            if (e.shiftKey) {
              addToSelection(selectedNodeIds);
            } else {
              selectMultiple(selectedNodeIds);
            }
          }
        }

        setSelectionBox(null);
        selectionBoxRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return;
    }

    clearSelection();

    setIsDragging(true);
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
      ref={containerRef}
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
      <SelectionBox box={selectionBox} selectionColor={selectionColor} />
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
        {children}
      </Box>
    </Box>
  );
};

const FlowNode = ({ isRoot = false, onAddNode, variant, ...props }) => {
  if (!isRoot) {
    return <NodeContent onAddNode={onAddNode} variant={variant} {...props} />;
  }

  const baseStyle = getBaseStyleForVariant(variant);
  const selectionColor = baseStyle.selectionColor ?? "#64748b";

  return (
    <SelectionProvider>
      <FlowCanvas onAddNode={onAddNode} selectionColor={selectionColor}>
        <NodeContent onAddNode={onAddNode} variant={variant} {...props} />
      </FlowCanvas>
    </SelectionProvider>
  );
};

export default FlowNode;
