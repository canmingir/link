import type { BoardFlow } from "./FlowBoard";
import { Box } from "@mui/material";
import type { FlowNodeData } from "../nodes/FlowNodeView";
import FlowNodeView from "../nodes/FlowNodeView";

import type { FlowNode, FlowNodeMap, Point } from "../types";
import type { FlowPluginArg, FlowStyleResolver } from "../hooks/useNodeStyle";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { assertLinkedGraph, buildTreeFromLinked } from "../utils/flowUtils";
import { useEffect, useMemo, useRef, useState } from "react";

interface FlowBoardItemProps {
  flow?: BoardFlow;
  flowId?: string | number;
  position?: Point;
  onPositionChange?: (position: Point) => void;
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  label?: ReactNode;
  divider?: ReactNode;
}

const FlowBoardItem = ({
  flow,
  flowId,
  position: initialPosition,
  onPositionChange,
  variant,
  style,
  plugin,
  label,
  divider,
}: FlowBoardItemProps) => {
  const [position, setPosition] = useState<Point>(
    () => initialPosition || { x: 0, y: 0 }
  );

  useEffect(
    () => {
      if (initialPosition) setPosition({ ...initialPosition });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialPosition?.x, initialPosition?.y]
  );

  const didDragRef = useRef(false);

  const namespacedFlow = useMemo(() => {
    if (flowId === null || flowId === undefined) return flow;
    const prefix = `${flowId}::`;
    const ns = (id: unknown) =>
      typeof id === "string" && !id.startsWith(prefix) ? `${prefix}${id}` : id;

    const nodes: FlowNodeMap = {};
    for (const [id, node] of Object.entries<FlowNode>(flow?.nodes || {})) {
      const nextArr = Array.isArray(node.next)
        ? node.next.map((n) => (typeof n === "string" ? ns(n) : n))
        : node.next !== null && node.next !== undefined
        ? ns(node.next)
        : undefined;
      nodes[ns(id) as string] = {
        ...node,
        id: ns(id) as string,
        next: nextArr as FlowNode["next"],
        previous:
          node.previous !== null && node.previous !== undefined
            ? (ns(node.previous) as string)
            : undefined,
      };
    }
    const roots = Array.isArray(flow?.roots) ? flow.roots.map(ns) : flow?.roots;
    return { ...flow, nodes, roots };
  }, [flow, flowId]);

  const { nodesById, roots } = useMemo(
    () => assertLinkedGraph(namespacedFlow),
    [namespacedFlow]
  );

  const treesData = useMemo(() => {
    if (!roots?.length) return [];
    return roots
      .map((rootId) => buildTreeFromLinked(rootId, nodesById))
      .filter((t): t is NonNullable<typeof t> => Boolean(t));
  }, [nodesById, roots]);

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target?.closest?.(".MuiCard-root") || target?.closest?.("button"))
      return;

    e.stopPropagation();
    didDragRef.current = false;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosition = { ...position };
    let lastPosition = startPosition;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!didDragRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        didDragRef.current = true;
      }
      lastPosition = { x: startPosition.x + dx, y: startPosition.y + dy };
      setPosition(lastPosition);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (didDragRef.current) onPositionChange?.(lastPosition);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (!treesData.length) return null;

  return (
    <Box
      data-flow-id={label}
      onMouseDown={handleMouseDown}
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
      }}
    >
      {label !== null && label !== undefined && (
        <Box
          sx={{
            position: "absolute",
            top: -28,
            left: 0,
            fontSize: 12,
            fontWeight: 600,
            opacity: 0.6,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Box>
      )}
      {divider !== null && divider !== undefined && (
        <Box sx={{ width: "100%", mb: 1 }}>{divider}</Box>
      )}
      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {treesData.map((tree, idx) => (
          <FlowNodeView
            key={tree.id || `tree-${idx}`}
            node={tree as unknown as FlowNodeData}
            variant={variant}
            style={style}
            plugin={plugin}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FlowBoardItem;
