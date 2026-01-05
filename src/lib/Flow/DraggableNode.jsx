import { Box } from "@mui/material";
import { useSelection } from "./SelectionContext";

import React, { useCallback, useEffect, useRef, useState } from "react";

const DraggableNode = ({
  children,
  registerRef,
  onDrag,
  nodeId,
  selectionColor = "#64748b",
  initialPosition,
  onConnect,
}) => {
  const [offset, setOffset] = useState(() =>
    initialPosition ? { ...initialPosition } : { x: 0, y: 0 }
  );

  const localRef = useRef(null);
  const lastDeltaRef = useRef({ x: 0, y: 0 });
  const onDragRef = useRef(onDrag);

  const {
    isSelected,
    selectNode,
    toggleSelection,
    clearSelection,
    registerNodeHandlers,
    moveSelectedNodes,
    selectedIds,
  } = useSelection();

  const selected = isSelected(nodeId);

  useEffect(() => {
    onDragRef.current = onDrag;
  }, [onDrag]);

  useEffect(() => {
    if (!nodeId) return;

    return registerNodeHandlers(nodeId, {
      setOffset,
      onDrag: () => onDragRef.current?.(),
    });
  }, [nodeId, registerNodeHandlers]);

  const setRef = useCallback(
    (el) => {
      localRef.current = el;
      registerRef?.(el);
    },
    [registerRef]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      e.stopPropagation();

      if (e.altKey && onConnect) {
        e.preventDefault();
        onConnect(nodeId, [...selectedIds]);
        return;
      }

      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        toggleSelection(nodeId);
        return;
      }

      if (!selected) {
        clearSelection();
        selectNode(nodeId);
      }

      const startX = e.clientX;
      const startY = e.clientY;
      const startOffset = { ...offset };
      lastDeltaRef.current = { x: 0, y: 0 };

      const handleMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        const deltaDx = dx - lastDeltaRef.current.x;
        const deltaDy = dy - lastDeltaRef.current.y;
        lastDeltaRef.current = { x: dx, y: dy };

        setOffset({
          x: startOffset.x + dx,
          y: startOffset.y + dy,
        });

        if (selectedIds.size > 1) {
          moveSelectedNodes(deltaDx, deltaDy, nodeId);
        }

        onDragRef.current?.();
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [
      nodeId,
      offset,
      selected,
      selectedIds,
      selectNode,
      toggleSelection,
      clearSelection,
      moveSelectedNodes,
      onConnect,
    ]
  );

  return (
    <Box
      ref={setRef}
      data-node-id={nodeId}
      onMouseDown={handleMouseDown}
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
        ...(selected && {
          "&::after": {
            content: '""',
            position: "absolute",
            inset: -6,
            border: `2px solid ${selectionColor}`,
            borderRadius: "12px",
            pointerEvents: "none",
            boxShadow: `0 0 8px ${selectionColor}66`,
          },
        }),
      }}
    >
      {children}
    </Box>
  );
};

export default DraggableNode;
