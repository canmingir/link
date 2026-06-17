import React, { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";
import FloatingGraph from "../graph/FloatingGraph";
import SelectionOverlay from "../selection/SelectionOverlay";
import { useSelection } from "../selection/SelectionContext";

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
  initialZoom = 1,
  sx = {},
  ...rest
}) => {
  const clampZoom = (zoom) => Math.min(2.5, Math.max(0.25, zoom));

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const [shouldCenter, setShouldCenter] = useState(true);

  const containerRef = useRef(null);
  const selectionBoxRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const innerRef = useRef(null);
  const didDragRef = useRef(false);

  const {
    clearSelection,
    selectMultiple,
    addToSelection,
    cutSelectedNodes,
    pasteNodes,
    selectedIds,
  } = useSelection();

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const observer = new ResizeObserver(() => {
      const contentWidth = inner.scrollWidth;
      const contentHeight = inner.scrollHeight;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const exceeds =
        contentWidth > containerWidth || contentHeight > containerHeight;
      setShouldCenter(!exceeds);
    });

    observer.observe(inner);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

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
      e.preventDefault();

      let deltaX = e.deltaX;
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) {
        deltaX *= 20;
        deltaY *= 20;
      } else if (e.deltaMode === 2) {
        deltaX *= 400;
        deltaY *= 400;
      }

      const wantsZoom = e.ctrlKey || e.metaKey;

      if (wantsZoom) {
        const maxDelta = 15;
        const clamped = Math.max(-maxDelta, Math.min(maxDelta, deltaY));
        const factor = Math.exp(-clamped * 0.007);
        setZoom((z) => clampZoom(z * factor));
      } else if (e.shiftKey) {
        const delta = deltaX !== 0 ? deltaX : deltaY;
        setOffset((prev) => ({
          x: prev.x - delta,
          y: prev.y,
        }));
      } else {
        setOffset((prev) => ({
          x: prev.x - deltaX,
          y: prev.y - deltaY,
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

    const isPan = e.button === 0 || e.button === 2;
    if (!isPan) return;

    const startX = e.clientX;
    const startY = e.clientY;
    didDragRef.current = false;

    if (e.button === 0 && (e.shiftKey || e.ctrlKey || e.metaKey)) {
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

    if (e.button === 0) clearSelection();

    setIsDragging(true);
    const startOffset = { ...offset };

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!didDragRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        didDragRef.current = true;
      }
      setOffset({
        x: startOffset.x + dx,
        y: startOffset.y + dy,
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onClickCapture = (e) => {
      if (didDragRef.current) {
        e.stopPropagation();
        e.preventDefault();
        didDragRef.current = false;
      }
    };

    container.addEventListener("click", onClickCapture, true);
    return () => container.removeEventListener("click", onClickCapture, true);
  }, []);

  return (
    <Box
      ref={containerRef}
      onMouseDown={handleViewportMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      sx={{
        width: "100%",
        height: height,
        overflow: "hidden",
        bgcolor: "none",
        cursor: isDragging ? "grabbing" : "default",
        userSelect: "none",
        position: "relative",
      }}
    >
      <SelectionOverlay box={selectionBox} selectionColor={selectionColor} />
      <Box
        ref={innerRef}
        sx={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: shouldCenter ? "center" : "flex-start",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          pointerEvents: "auto",
          position: "relative",
          pl: variant === "horizontal" ? 4 : 0,
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
