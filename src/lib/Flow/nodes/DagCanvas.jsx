import { Box } from "@mui/material";

import React, { useCallback, useMemo, useState } from "react";

import DagEdges from "../connectors/DagEdges";
import DefaultNodeCard from "./DefaultCard";
import DraggableNode from "./DraggableNode";
import { getContentParts } from "../utils/flowUtils";
import { useNodeStyle } from "../hooks/useNodeStyle";

const DagNode = ({
  node,
  positionedStyle,
  type,
  variant,
  style,
  plugin,
  onConnect,
  registerSize,
  dragTick,
  onDrag,
}) => {
  const { baseStyle, nodeStyle, plugin: _plugin } = useNodeStyle({
    node,
    type,
    variant,
    style,
    plugin,
  });

  const {
    nodeSx = {},
    borderWidth,
    borderColor = baseStyle.borderColor,
    cardWidth,
    shape,
    shadowLevel,
    minHeight,
    selectionColor = baseStyle.selectionColor ?? "#64748b",
  } = nodeStyle;

  const { title, subtitle, metaEntries } = getContentParts(node);

  const content =
    _plugin && typeof _plugin.node === "function" ? (
      _plugin.node({ node, title, subtitle, metaEntries, nodeStyle, baseStyle })
    ) : (
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

  const measureRef = useCallback(
    (el) => {
      if (!el) return;
      registerSize?.(node.id, {
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
    },
    [node.id, registerSize],
  );

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1,
        ...positionedStyle,
      }}
    >
      <DraggableNode
        nodeId={node.id}
        selectionColor={selectionColor}
        onConnect={onConnect}
        onDrag={onDrag}
        registerRef={measureRef}
        dragResetKey={dragTick}
      >
        {content}
      </DraggableNode>
    </Box>
  );
};

const DagCanvas = ({
  nodesById,
  positions,
  layoutEdges,
  layoutBounds,
  type,
  variant,
  style,
  plugin,
  onConnect,
}) => {
  const [sizes, setSizes] = useState({});
  const [dragOffsets, setDragOffsets] = useState({});

  const registerSize = useCallback((id, size) => {
    setSizes((prev) => {
      const current = prev[id];
      if (
        current &&
        current.width === size.width &&
        current.height === size.height
      ) {
        return prev;
      }
      return { ...prev, [id]: size };
    });
  }, []);

  const handleNodeDrag = useCallback((id, delta) => {
    setDragOffsets((prev) => ({ ...prev, [id]: delta }));
  }, []);

  const layoutKey = useMemo(() => JSON.stringify(positions ?? {}), [positions]);
  const [appliedLayoutKey, setAppliedLayoutKey] = useState(layoutKey);
  if (layoutKey !== appliedLayoutKey) {
    setAppliedLayoutKey(layoutKey);
    if (Object.keys(dragOffsets).length) setDragOffsets({});
  }

  const { baseStyle } = useNodeStyle({
    node: undefined,
    type,
    variant,
    style,
    plugin,
  });

  const boxes = useMemo(() => {
    const out = {};
    for (const id of Object.keys(positions ?? {})) {
      const pos = positions[id];
      if (!pos) continue;
      const size = sizes[id];
      const drag = dragOffsets[id] ?? { x: 0, y: 0 };
      out[id] = {
        x: pos.x + drag.x,
        y: pos.y + drag.y,
        width: size?.width ?? pos.width ?? 0,
        height: size?.height ?? pos.height ?? 0,
      };
    }
    return out;
  }, [positions, sizes, dragOffsets]);

  const resolvedPlugin = useMemo(() => {
    if (!plugin) return null;
    if (typeof plugin === "function") return plugin(type, undefined) || null;
    return plugin;
  }, [plugin, type]);

  const styleTokensFor = useCallback(
    (node) => {
      let tokens = {};
      if (typeof style === "function") {
        tokens = style(node) || {};
      } else if (style && typeof style === "object") {
        tokens = style;
      }

      if (resolvedPlugin && typeof resolvedPlugin.style === "function") {
        tokens = {
          ...tokens,
          ...(resolvedPlugin.style({ node, style: tokens }) || {}),
        };
      }

      return tokens;
    },
    [style, resolvedPlugin],
  );

  const resolveEdgeProps = useCallback(
    (edge) => {
      const node = nodesById?.[edge.source];
      const child = nodesById?.[edge.target];
      if (!node || !child) return {};

      const tokens = styleTokensFor(node);

      const fromTokens = {};
      for (const key of [
        "lineColor",
        "lineWidth",
        "lineStyle",
        "showDots",
        "dotRadius",
        "dotColor",
        "showArrow",
        "arrowSize",
        "animated",
        "animationSpeed",
        "gradient",
        "curvature",
        "connectorType",
        "startGap",
        "endGap",
      ]) {
        if (tokens[key] !== undefined) fromTokens[key] = tokens[key];
      }

      const fromPlugin =
        resolvedPlugin && typeof resolvedPlugin.edge === "function"
          ? resolvedPlugin.edge({ node, child, style: tokens }) || {}
          : {};

      return { ...fromTokens, ...fromPlugin };
    },
    [resolvedPlugin, nodesById, styleTokensFor],
  );

  const baseEdgeProps = useMemo(
    () => ({
      lineColor: baseStyle.lineColor,
      lineWidth: baseStyle.lineWidth,
      lineStyle: baseStyle.lineStyle,
      showDots: baseStyle.showDots,
      dotRadius: baseStyle.dotRadius,
      dotColor: baseStyle.dotColor,
      showArrow: baseStyle.showArrow,
      arrowSize: baseStyle.arrowSize,
      animated: baseStyle.animated,
      animationSpeed: baseStyle.animationSpeed,
      gradient: baseStyle.gradient,
      curvature: baseStyle.curvature,
      connectorType: baseStyle.connectorType,
      startGap: baseStyle.startGap,
      endGap: baseStyle.endGap,
    }),
    [baseStyle],
  );

  const isHorizontal = variant === "horizontal";

  if (!positions || !layoutBounds) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: layoutBounds.width,
        height: layoutBounds.height,
        flexShrink: 0,
      }}
    >
      <DagEdges
        edges={layoutEdges ?? []}
        boxes={boxes}
        bounds={layoutBounds}
        orientation={isHorizontal ? "horizontal" : "vertical"}
        baseEdgeProps={baseEdgeProps}
        resolveEdgeProps={resolveEdgeProps}
      />

      {Object.keys(positions).map((id) => {
        const node = nodesById?.[id];
        if (!node) return null;

        const pos = positions[id];

        return (
          <DagNode
            key={id}
            node={node}
            positionedStyle={{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
            }}
            type={type}
            variant={variant}
            style={style}
            plugin={plugin}
            onConnect={onConnect}
            registerSize={registerSize}
            dragTick={appliedLayoutKey}
            onDrag={(delta) => handleNodeDrag(id, delta)}
          />
        );
      })}
    </Box>
  );
};

export default DagCanvas;
