import { Box } from "@mui/material";

import { useCallback, useMemo, useState } from "react";

import type { DagBox, DagEdgeProps } from "../connectors/DagEdges";
import DagEdges from "../connectors/DagEdges";
import type {
  DagLayoutBounds,
  DagLayoutEdge,
  DagLayoutPositions,
} from "../utils/dagLayout";
import DefaultNodeCard from "./DefaultCard";
import DraggableNode from "./DraggableNode";
import type { FlowNode, FlowNodeMap, Point } from "../types";
import type { FlowPluginArg, FlowStyleResolver } from "../hooks/useNodeStyle";
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
}: {
  node: FlowNode;
  positionedStyle: { transform: string };
  type?: string;
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  onConnect?: (nodeId: string, selectedIds: string[]) => void;
  registerSize?: (id: string, size: { width: number; height: number }) => void;
  dragTick?: string;
  onDrag?: (offset?: Point) => void;
}) => {
  const {
    baseStyle,
    nodeStyle,
    plugin: resolvedPlugin,
  } = useNodeStyle({
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
    resolvedPlugin && typeof resolvedPlugin.node === "function" ? (
      resolvedPlugin.node({
        node,
        title,
        subtitle,
        metaEntries,
        nodeStyle,
        baseStyle,
      })
    ) : (
      <DefaultNodeCard
        title={title}
        subtitle={subtitle}
        metaEntries={metaEntries}
        nodeStyle={nodeStyle}
        baseStyle={baseStyle}
        variant={variant}
        borderWidth={borderWidth as number | undefined}
        borderColor={borderColor as string | undefined}
        cardWidth={cardWidth as number | undefined}
        shape={shape as number | string | undefined}
        shadowLevel={shadowLevel as number | undefined}
        minHeight={minHeight as number | undefined}
        nodeSx={nodeSx}
      />
    );

  const measureRef = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      registerSize?.(node.id, {
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
    },
    [node.id, registerSize]
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
        selectionColor={selectionColor as string}
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
}: {
  nodesById?: FlowNodeMap;
  positions?: DagLayoutPositions;
  layoutEdges?: DagLayoutEdge[];
  layoutBounds?: DagLayoutBounds;
  type?: string;
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  onConnect?: (nodeId: string, selectedIds: string[]) => void;
}) => {
  const [sizes, setSizes] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const [dragOffsets, setDragOffsets] = useState<Record<string, Point>>({});

  const registerSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
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
    },
    []
  );

  const handleNodeDrag = useCallback((id: string, delta?: Point) => {
    setDragOffsets((prev) => ({ ...prev, [id]: delta ?? { x: 0, y: 0 } }));
  }, []);

  const layoutKey = useMemo(() => JSON.stringify(positions ?? {}), [positions]);
  const [appliedLayoutKey, setAppliedLayoutKey] = useState(layoutKey);
  if (layoutKey !== appliedLayoutKey) {
    setAppliedLayoutKey(layoutKey);
    if (Object.keys(dragOffsets).length) setDragOffsets({});
  }

  const { baseStyle } = useNodeStyle({
    node: { id: "", type, virtual: true },
    type,
    variant,
    style,
    plugin,
  });

  const boxes = useMemo(() => {
    const out: Record<string, DagBox> = {};
    for (const id of Object.keys(positions ?? {})) {
      const pos = positions?.[id];
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
    if (typeof plugin === "function")
      return plugin(type, { id: "", type, virtual: true }) || null;
    return plugin;
  }, [plugin, type]);

  const styleTokensFor = useCallback(
    (node: FlowNode) => {
      let tokens: Record<string, unknown> = {};
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
    [style, resolvedPlugin]
  );

  const resolveEdgeProps = useCallback(
    (edge: DagLayoutEdge): DagEdgeProps => {
      const node = nodesById?.[edge.source];
      const child = nodesById?.[edge.target];
      if (!node || !child) return {};

      const tokens = styleTokensFor(node);

      const fromTokens: DagEdgeProps = {};
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
      ] as const) {
        if (tokens[key] !== undefined) {
          (fromTokens as Record<string, unknown>)[key] = tokens[key];
        }
      }

      const fromPlugin: DagEdgeProps =
        resolvedPlugin && typeof resolvedPlugin.edge === "function"
          ? (resolvedPlugin.edge({ node, child, style: tokens }) as
              | DagEdgeProps
              | null
              | undefined) || {}
          : {};

      return { ...fromTokens, ...fromPlugin };
    },
    [resolvedPlugin, nodesById, styleTokensFor]
  );

  const baseEdgeProps: DagEdgeProps = useMemo(
    () => ({
      lineColor: baseStyle.lineColor,
      lineWidth: baseStyle.lineWidth,
      lineStyle: baseStyle.lineStyle,
      showDots: baseStyle.showDots,
      dotRadius: baseStyle.dotRadius as number | undefined,
      dotColor: baseStyle.dotColor as string | undefined,
      showArrow: baseStyle.showArrow,
      arrowSize: baseStyle.arrowSize,
      animated: baseStyle.animated,
      animationSpeed: baseStyle.animationSpeed,
      gradient: baseStyle.gradient,
      curvature: baseStyle.curvature,
      connectorType: baseStyle.connectorType,
      startGap: baseStyle.startGap as number | undefined,
      endGap: baseStyle.endGap as number | undefined,
    }),
    [baseStyle]
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
