import type { BoardFlow } from "./FlowBoard";
import { Box } from "@mui/material";
import type { FlowNodeData } from "../nodes/FlowNodeView";
import FlowNodeView from "../nodes/FlowNodeView";
import { useSelection } from "../selection/SelectionContext";

import type { FlowNode, FlowNodeMap, Point } from "../types";
import type { FlowPluginArg, FlowStyleResolver } from "../hooks/useNodeStyle";
import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { assertLinkedGraph, buildTreeFromLinked } from "../utils/flowUtils";
import { useEffect, useMemo, useRef, useState } from "react";

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
}: {
  flow?: BoardFlow;
  flowId?: string | number;
  position?: Point;
  onPositionChange?: (position: Point) => void;
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  label?: ReactNode;
  divider?: ReactNode;
}) => {
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
  const { nodeTouchDragRef } = useSelection();

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

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const isTouch = e.pointerType === "touch";
    if (!isTouch && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target?.closest?.(".MuiCard-root") || target?.closest?.("button"))
      return;
    if (isTouch && nodeTouchDragRef?.current) return;

    e.stopPropagation();
    didDragRef.current = false;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosition = { ...position };
    let lastPosition = startPosition;

    const onMove = (ev: PointerEvent) => {
      if (isTouch && ev.pointerId !== e.pointerId) return;

      if (dragToken.lastPointer) {
        dragToken.lastPointer = {
          pointerId: ev.pointerId,
          x: ev.clientX,
          y: ev.clientY,
        };
      }

      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!didDragRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        didDragRef.current = true;
      }
      lastPosition = { x: startPosition.x + dx, y: startPosition.y + dy };
      setPosition(lastPosition);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (nodeTouchDragRef?.current === dragToken) {
        nodeTouchDragRef.current = null;
      }
      if (didDragRef.current) onPositionChange?.(lastPosition);
    };

    const dragToken = {
      lastPointer: isTouch
        ? { pointerId: e.pointerId, x: e.clientX, y: e.clientY }
        : null,
      cancel: () => {
        didDragRef.current = false;
        setPosition(startPosition);
        onUp();
      },
    };

    if (isTouch && nodeTouchDragRef) nodeTouchDragRef.current = dragToken;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  if (!treesData.length) return null;

  return (
    <Box
      data-flow-id={label}
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => e.preventDefault()}
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
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
