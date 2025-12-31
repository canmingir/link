import { Box } from "@mui/material";
import { useSelection } from "./SelectionContext";

import React, { useEffect, useRef, useState } from "react";

const DraggableNode = ({
  children,
  registerRef,
  onDrag,
  nodeId,
  selectionColor = "#64748b",
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const localRef = useRef(null);
  const lastDeltaRef = useRef({ x: 0, y: 0 });

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
  const onDragRef = useRef(onDrag);

  useEffect(() => {
    onDragRef.current = onDrag;
  }, [onDrag]);

  useEffect(() => {
    if (nodeId) {
      return registerNodeHandlers(nodeId, {
        setOffset,
        onDrag: () => onDragRef.current?.(),
      });
    }
  }, [nodeId, registerNodeHandlers]);

  const setRef = (el) => {
    localRef.current = el;
    if (registerRef) registerRef(el);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();

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

    const onMove = (ev) => {
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

      if (onDrag) onDrag();
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

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
        "&:active": {
          cursor: "grabbing",
        },
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
