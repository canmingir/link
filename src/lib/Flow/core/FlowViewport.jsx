import { Box } from "@mui/material";
import FloatingGraph from "../graph/FloatingGraph";
import SelectionOverlay from "../selection/SelectionOverlay";
import { useSelection } from "../selection/SelectionContext";

import React, { useEffect, useRef, useState } from "react";

const FlowViewport = ({
  children,
  selectionColor = "#64748b",
  nodesById,
  onPaste,
  onCut,
  onConnect,
  floatingNodes = [],
  variant,
  style,
  plugin,
  height = "100vh",
  sx = {},
  ...rest
}) => {
  const clampZoom = (zoom) => Math.min(2.5, Math.max(0.25, zoom));

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);

  const containerRef = useRef(null);
  const selectionBoxRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const {
    clearSelection,
    selectMultiple,
    addToSelection,
    cutSelectedNodes,
    pasteNodes,
    selectedIds,
  } = useSelection();

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      const wantsZoom = e.ctrlKey || e.metaKey;

      if (wantsZoom) {
        e.preventDefault();
        const direction = e.deltaY > 0 ? -1 : 1;
        const factor = direction > 0 ? 1.1 : 1 / 1.1;
        setZoom((z) => clampZoom(z * factor));
      } else if (e.shiftKey) {
        e.preventDefault();
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        setOffset((prev) => ({
          x: prev.x - delta,
          y: prev.y,
        }));
      } else {
        e.preventDefault();
        setOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      if (e.key === "x" && selectedIds.size > 0 && nodesById) {
        e.preventDefault();
        cutSelectedNodes(nodesById, onCut);
      }

      if (e.key === "v" && onPaste) {
        e.preventDefault();
        const containerRect = containerRef.current?.getBoundingClientRect();
        const mousePos = mousePositionRef.current;

        const canvasX = containerRect
          ? (mousePos.x -
              containerRect.left -
              containerRect.width / 2 -
              offset.x) /
            zoom
          : 0;
        const canvasY = containerRect
          ? (mousePos.y -
              containerRect.top -
              containerRect.height / 2 -
              offset.y) /
            zoom
          : 0;

        pasteNodes(onPaste, canvasX, canvasY);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    cutSelectedNodes,
    pasteNodes,
    selectedIds,
    nodesById,
    onPaste,
    onCut,
    offset,
    zoom,
  ]);

  const handleViewportMouseDown = (e) => {
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
      onMouseDown={handleViewportMouseDown}
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
      <SelectionOverlay box={selectionBox} selectionColor={selectionColor} />
      <Box
        sx={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: variant === "horizontal" ? "flex-start" : "center",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          pointerEvents: "auto",
          position: "relative",
        }}
      >
        {children}
        {floatingNodes.map((structure, index) => {
          const structureKey =
            (structure && (structure.id || structure.key)) ??
            `floating-${index}`;
          return (
            <FloatingGraph
              key={structureKey}
              structure={structure}
              variant={variant}
              style={style}
              plugin={plugin}
              selectionColor={selectionColor}
              onConnect={onConnect}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default FlowViewport;
