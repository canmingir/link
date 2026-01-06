import { Box } from "@mui/material";
import DefaultNodeCard from "./DefaultCard";
import DraggableNode from "./DraggableNode";
import DynamicConnector from "../connectors/DynamicConnector";
import FlowNode from "../core/FlowNode";
import { getContentParts } from "../utils/flowUtils";
import { toPxNumber } from "../styles";
import { useNodeStyle } from "../hooks/useNodeStyle";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const FlowNodeView = ({
  node,
  type,
  variant,
  style,
  plugin,
  registerRef,
  onDrag,
  onConnect,
}) => {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  const {
    baseStyle,
    nodeStyle,
    plugin: _plugin,
  } = useNodeStyle({
    node,
    type,
    variant,
    style,
    plugin,
  });

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
    return (
      <DefaultNodeCard
        title={title}
        subtitle={subtitle}
        metaEntries={metaEntries}
        nodeStyle={nodeStyle}
        baseStyle={baseStyle}
        variant={variant}
        borderWidth={borderWidth}
        borderColor={borderColor}
        cardWidth={cardWidth}
        shape={shape}
        shadowLevel={shadowLevel}
        minHeight={minHeight}
        nodeSx={nodeSx}
      />
    );
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
        initialPosition={node._pastePosition}
        onConnect={onConnect}
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
                onConnect={onConnect}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default FlowNodeView;
