import { Box } from "@mui/material";
import { useSelection } from "../selection/SelectionContext";

import {
  LONG_PRESS_DELAY_MS,
  LONG_PRESS_MOVE_TOLERANCE,
} from "../utils/viewportUtils";
import React, { useCallback, useEffect, useRef, useState } from "react";

const DraggableNode = ({
  children,
  registerRef,
  onDrag,
  nodeId,
  selectionColor = "#373739",
  initialPosition,
  onConnect,
  dragResetKey,
}) => {
  const [offset, setOffset] = useState(() =>
    initialPosition ? { ...initialPosition } : { x: 0, y: 0 }
  );

  const offsetRef = useRef(offset);

  const applyOffset = useCallback((next) => {
    setOffset((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      offsetRef.current = resolved;
      return resolved;
    });
  }, []);

  useEffect(() => {
    if (initialPosition) {
      applyOffset({ ...initialPosition });
    } else {
      applyOffset({ x: 0, y: 0 });
    }
  }, [initialPosition, applyOffset]);

  useEffect(() => {
    if (dragResetKey === undefined) return;
    applyOffset({ x: 0, y: 0 });
  }, [dragResetKey, applyOffset]);

  const localRef = useRef(null);
  const lastDeltaRef = useRef({ x: 0, y: 0 });
  const onDragRef = useRef(onDrag);
  const didDragRef = useRef(false);
  const activeDragRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const {
    isSelected,
    selectNode,
    toggleSelection,
    clearSelection,
    registerNodeHandlers,
    moveSelectedNodes,
    selectedIds,
    pinchBridgeRef,
    nodeTouchDragRef,
  } = useSelection();

  const selected = isSelected(nodeId);

  useEffect(() => {
    onDragRef.current = onDrag;
  }, [onDrag]);

  useEffect(() => {
    if (!nodeId) return;

    return registerNodeHandlers(nodeId, {
      setOffset: applyOffset,
      onDrag: () => onDragRef.current?.(offsetRef.current),
    });
  }, [nodeId, registerNodeHandlers, applyOffset]);

  const setRef = useCallback(
    (el) => {
      localRef.current = el;
      registerRef?.(el);
    },
    [registerRef]
  );

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const onClickCapture = (e) => {
      if (didDragRef.current) {
        e.stopPropagation();
        e.preventDefault();
        didDragRef.current = false;
      }
    };

    el.addEventListener("click", onClickCapture, true);
    return () => el.removeEventListener("click", onClickCapture, true);
  }, []);

  const handlePointerDown = useCallback(
    (e) => {
      if (e.target?.closest?.("[data-handle-type]")) return;

      const isTouch = e.pointerType === "touch";
      if (!isTouch && e.button !== 0) return;
      if (isTouch && activeDragRef.current) return;

      e.stopPropagation();

      didDragRef.current = false;

      if (onConnect && !isTouch && e.altKey) {
        e.preventDefault();
        onConnect(nodeId, [...selectedIds]);
        return;
      }

      if (!isTouch && (e.shiftKey || e.ctrlKey || e.metaKey)) {
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

      const el = localRef.current;
      const rect = el?.getBoundingClientRect();
      const scale =
        el && rect && el.offsetWidth ? rect.width / el.offsetWidth || 1 : 1;

      const handleMove = (ev) => {
        if (isTouch && ev.pointerId !== e.pointerId) return;

        if (dragToken.lastPointer) {
          dragToken.lastPointer = {
            pointerId: ev.pointerId,
            x: ev.clientX,
            y: ev.clientY,
          };
        }

        const dx = (ev.clientX - startX) / scale;
        const dy = (ev.clientY - startY) / scale;

        if (
          isTouch &&
          longPressTimerRef.current &&
          Math.hypot(dx, dy) > LONG_PRESS_MOVE_TOLERANCE
        ) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        if (!didDragRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          didDragRef.current = true;
        }

        const deltaDx = dx - lastDeltaRef.current.x;
        const deltaDy = dy - lastDeltaRef.current.y;
        lastDeltaRef.current = { x: dx, y: dy };

        const nextOffset = {
          x: startOffset.x + dx,
          y: startOffset.y + dy,
        };

        applyOffset(nextOffset);

        if (selectedIds.size > 1) {
          moveSelectedNodes(deltaDx, deltaDy, nodeId);
        }

        onDragRef.current?.(nextOffset);
      };

      const dragToken = {
        lastPointer: isTouch
          ? { pointerId: e.pointerId, x: e.clientX, y: e.clientY }
          : null,
      };

      const clearLongPressTimer = () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      };

      const handleUp = () => {
        clearLongPressTimer();
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        window.removeEventListener("pointerdown", handleSecondPointerDown);
        if (activeDragRef.current === dragToken) {
          activeDragRef.current = null;
          if (nodeTouchDragRef) nodeTouchDragRef.current = false;
        }
      };

      dragToken.cancel = () => {
        didDragRef.current = false;
        handleUp();
      };

      const handleSecondPointerDown = (ev) => {
        if (ev.pointerType !== "touch" || ev.pointerId === e.pointerId) return;
        const firstPointer = dragToken.lastPointer;
        dragToken.cancel();

        if (firstPointer && pinchBridgeRef?.current) {
          pinchBridgeRef.current(firstPointer, {
            pointerId: ev.pointerId,
            x: ev.clientX,
            y: ev.clientY,
          });
        }
      };

      if (isTouch) {
        activeDragRef.current = dragToken;
        if (nodeTouchDragRef) nodeTouchDragRef.current = true;
        window.addEventListener("pointerdown", handleSecondPointerDown);

        const el = localRef.current;
        longPressTimerRef.current = setTimeout(() => {
          longPressTimerRef.current = null;
          if (didDragRef.current) return;
          const contextMenuEvent = new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            clientX: startX,
            clientY: startY,
          });
          contextMenuEvent.__fromLongPress = true;
          el?.dispatchEvent(contextMenuEvent);
        }, LONG_PRESS_DELAY_MS);
      }

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
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
      applyOffset,
      pinchBridgeRef,
      nodeTouchDragRef,
    ]
  );

  return (
    <Box
      ref={setRef}
      data-node-id={nodeId}
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => {
        if (!e.nativeEvent?.__fromLongPress) e.preventDefault();
      }}
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        "&:active": { cursor: "grabbing" },
      }}
    >
      {children}
      {selected &&
        selectedIds.size > 1 &&
        [
          {
            top: -10,
            left: -6,
            borderTop: 2,
            borderLeft: 2,
            color: selectionColor,
          },
          {
            top: -8,
            right: -12,
            borderTop: 2,
            borderRight: 2,
            color: selectionColor,
          },
          {
            bottom: -14,
            left: -6,
            borderBottom: 2,
            borderLeft: 2,
            color: selectionColor,
          },
          {
            bottom: -16,
            right: -12,
            borderBottom: 2,
            borderRight: 2,
            color: selectionColor,
          },
        ].map((pos, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: 10,
              height: 10,
              borderStyle: "solid",
              borderColor: selectionColor,
              borderWidth: 0,
              pointerEvents: "none",
              ...pos,
            }}
          />
        ))}
    </Box>
  );
};

export default DraggableNode;
