import { Box } from "@mui/material";
import FloatingGraph from "../graph/FloatingGraph";
import type { FloatingStructure } from "../hooks/useGraphOperations";
import type { ImpliedBinding } from "../connectors/ImpliedConnections";
import ImpliedConnections from "../connectors/ImpliedConnections";
import type { PasteStructure } from "../selection/SelectionContext";
import { useSelection } from "../selection/SelectionContext";

import {
  DEFAULT_FIT_VIEW_MAX_ZOOM,
  DEFAULT_FIT_VIEW_MIN_ZOOM,
  DEFAULT_FIT_VIEW_PADDING,
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  LONG_PRESS_MOVE_TOLERANCE,
  clampZoomValue,
  computeFitViewState,
  computePinchZoomOffset,
  getTouchDistance,
  getTouchMidpoint,
} from "../utils/viewportUtils";
import type { DagLayoutPositions } from "../utils/dagLayout";
import type {
  FitAlign,
  FitViewOptions,
  FlowNodeMap,
  FlowViewportHandle,
  Point,
  SetCenterOptions,
} from "../types";
import type { FlowPluginArg, FlowStyleResolver } from "../hooks/useNodeStyle";
import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
export interface FlowViewportProps {
  children?: ReactNode;
  selectionColor?: string;
  nodesById?: FlowNodeMap;
  onPaste?: (
    data: PasteStructure,
    position: { x: number; y: number }
  ) => unknown;
  onCut?: (ids: string[]) => void;
  onConnect?: (targetNodeId: string, selectedIds: string[]) => void;
  floatingNodes?: FloatingStructure[];
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  height?: number | string;
  initialZoom?: number;
  centered?: boolean;
  minZoom?: number;
  maxZoom?: number;
  fitViewPadding?: number;
  fitViewMinZoom?: number;
  fitViewMaxZoom?: number;
  fitViewAlign?: FitAlign;
  fitViewOnMount?: boolean;
  fitViewOnResize?: boolean;
  fitViewOnNodesChange?: boolean;
  onInit?: (handle: FlowViewportHandle) => void;
  impliedConnections?: ImpliedBinding[];
  showImpliedConnections?: boolean;
  labelForImpliedConnection?: (binding: ImpliedBinding) => ReactNode;
  positions?: DagLayoutPositions;
  sx?: SxProps<Theme>;
}

const FlowViewport = forwardRef<FlowViewportHandle, FlowViewportProps>(
  function FlowViewport(
    {
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
      centered = false,
      minZoom = DEFAULT_MIN_ZOOM,
      maxZoom = DEFAULT_MAX_ZOOM,
      fitViewPadding = DEFAULT_FIT_VIEW_PADDING,
      fitViewMinZoom = DEFAULT_FIT_VIEW_MIN_ZOOM,
      fitViewMaxZoom = DEFAULT_FIT_VIEW_MAX_ZOOM,
      fitViewAlign = "start",
      fitViewOnMount = false,
      fitViewOnResize = false,
      fitViewOnNodesChange = false,
      onInit,
      impliedConnections,
      showImpliedConnections = false,
      labelForImpliedConnection,
      positions,
    },
    ref
  ) {
    const clampZoom = (z: number) => clampZoomValue(z, minZoom, maxZoom);

    const usesFitView =
      fitViewOnMount || fitViewOnResize || fitViewOnNodesChange;

    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(initialZoom);
    const [isDragging, setIsDragging] = useState(false);
    const [shouldCenter, setShouldCenter] = useState(true);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const mousePositionRef = useRef<Point>({ x: 0, y: 0 });
    const innerRef = useRef<HTMLDivElement | null>(null);
    const didDragRef = useRef(false);

    const zoomRef = useRef(zoom);
    const offsetRef = useRef(offset);
    useEffect(() => {
      zoomRef.current = zoom;
    }, [zoom]);
    useEffect(() => {
      offsetRef.current = offset;
    }, [offset]);


    const activePointersRef = useRef(new Map<number, { x: number; y: number; }>());
    const pinchStateRef = useRef<{lastDistance: number; lastMidpoint: Point} | {panStartX: number; panStartY: number; panStartOffset: Point} | null>(null);
    const gestureModeRef = useRef<"pan" | "pinch" | null>(null);

    const {
      clearSelection,
      cutSelectedNodes,
      pasteNodes,
      selectedIds,
      pinchBridgeRef,
      nodeTouchDragRef,
    } = useSelection();

    useEffect(() => {
      if (centered || usesFitView) return;

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
    }, [centered, usesFitView]);

    const runFitView = useCallback(
      (options: FitViewOptions = {}) => {
        const fit = computeFitViewState(containerRef.current, {
          zoom,
          offset,
          padding: options.padding ?? fitViewPadding,
          minZoom: options.minZoom ?? fitViewMinZoom,
          maxZoom: options.maxZoom ?? fitViewMaxZoom,
          align: options.align ?? fitViewAlign,
        });
        if (!fit) return;
        setZoom(fit.zoom);
        setOffset(fit.offset);
      },
      [
        zoom,
        offset,
        fitViewPadding,
        fitViewMinZoom,
        fitViewMaxZoom,
        fitViewAlign,
      ]
    );

    const zoomIn = useCallback(
      (step = 1.2) => setZoom((z) => clampZoom(z * step)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [minZoom, maxZoom]
    );

    const zoomOut = useCallback(
      (step = 1.2) => setZoom((z) => clampZoom(z / step)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [minZoom, maxZoom]
    );

    const setZoomPublic = useCallback(
      (z: number) => setZoom(clampZoom(z)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [minZoom, maxZoom]
    );

    const setCenter = useCallback(
      (x: number, y: number, options: SetCenterOptions = {}) => {
        const targetZoom = clampZoom(options.zoom ?? zoom);
        setZoom(targetZoom);
        setOffset({ x: -targetZoom * x, y: -targetZoom * y });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [zoom, minZoom, maxZoom]
    );

    const getZoom = useCallback(() => zoom, [zoom]);

    const runFitViewRef = useRef(runFitView);
    useEffect(() => {
      runFitViewRef.current = runFitView;
    }, [runFitView]);

    useImperativeHandle(
      ref,
      () => ({
        fitView: runFitView,
        zoomIn,
        zoomOut,
        setZoom: setZoomPublic,
        setCenter,
        getZoom,
      }),
      [runFitView, zoomIn, zoomOut, setZoomPublic, setCenter, getZoom]
    );

    const didFitOnMountRef = useRef(false);
    const hasPositions = positions ? Object.keys(positions).length > 0 : true;

    useEffect(() => {
      if (!fitViewOnMount || didFitOnMountRef.current || !hasPositions) return;

      didFitOnMountRef.current = true;
      runFitViewRef.current();
    }, [fitViewOnMount, hasPositions]);

    useEffect(() => {
      if (!fitViewOnResize) return;

      const container = containerRef.current;
      if (!container) return;

      let frame: number | null = null;
      let isFirstCallback = true;
      const observer = new ResizeObserver(() => {
        if (isFirstCallback) {
          isFirstCallback = false;
          return;
        }
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => runFitViewRef.current());
      });

      observer.observe(container);

      return () => {
        if (frame) cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }, [fitViewOnResize]);

    const nodeCount = nodesById ? Object.keys(nodesById).length : 0;

    const contentKey = positions
      ? `${nodeCount}:${Object.entries(positions)
          .map(
            ([id, box]) => `${id}@${box.x},${box.y},${box.width},${box.height}`
          )
          .join("|")}`
      : `${nodeCount}`;
    const previousContentKeyRef = useRef(contentKey);

    useEffect(() => {
      if (!fitViewOnNodesChange) return;

      if (previousContentKeyRef.current !== contentKey) {
        previousContentKeyRef.current = contentKey;
        let frame: number | undefined;
        const timeout = setTimeout(() => {
          frame = requestAnimationFrame(() => runFitViewRef.current());
        }, 100);
        return () => {
          clearTimeout(timeout);
          if (frame) cancelAnimationFrame(frame);
        };
      }
    }, [fitViewOnNodesChange, contentKey]);

    useEffect(() => {
      onInit?.({
        fitView: runFitView,
        zoomIn,
        zoomOut,
        setZoom: setZoomPublic,
        setCenter,
        getZoom,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const handlePointerMove = (e: PointerEvent) => {
        mousePositionRef.current = { x: e.clientX, y: e.clientY };
      };

      window.addEventListener("pointermove", handlePointerMove);

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
      };
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const onWheel = (e: WheelEvent) => {
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
          const prevZoom = zoomRef.current;
          const nextZoom = clampZoom(prevZoom * factor);
          const containerRect = container.getBoundingClientRect();
          const cursor = {
            x: e.clientX - (containerRect.left + containerRect.width / 2),
            y: e.clientY - (containerRect.top + containerRect.height / 2),
          };

          const nextOffset = computePinchZoomOffset({
            prevZoom,
            nextZoom,
            offset: offsetRef.current,
            prevMidpoint: cursor,
            nextMidpoint: cursor,
          });

          setZoom(nextZoom);
          setOffset(nextOffset);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
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

    const startPanGesture = (startX: number, startY: number) => {
      gestureModeRef.current = "pan";
      didDragRef.current = false;
      setIsDragging(true);
      pinchStateRef.current = {
        panStartX: startX,
        panStartY: startY,
        panStartOffset: { ...offsetRef.current },
      };
    };

    const startPinchGesture = () => {
      setIsDragging(true);

      const points = [...activePointersRef.current.values()];
      const midpoint = getTouchMidpoint(points[0], points[1]);
      gestureModeRef.current = "pinch";
      pinchStateRef.current = {
        lastDistance: getTouchDistance(points[0], points[1]),
        lastMidpoint: midpoint,
      };
    };

    useEffect(() => {
      if (!pinchBridgeRef) return;
      pinchBridgeRef.current = (pointerA, pointerB) => {
        activePointersRef.current.clear();
        activePointersRef.current.set(pointerA.pointerId, {
          x: pointerA.x,
          y: pointerA.y,
        });
        activePointersRef.current.set(pointerB.pointerId, {
          x: pointerB.x,
          y: pointerB.y,
        });
        startPinchGesture();
      };
    }, [pinchBridgeRef]);

    useEffect(() => {
      const onPointerDownCapture = (e: PointerEvent) => {
        if (
          e.pointerType !== "touch" ||
          !containerRef.current?.contains(e.target as Node | null)
        )
          return;
        if (activePointersRef.current.has(e.pointerId)) return;

        const wasTracking = activePointersRef.current.size;
        activePointersRef.current.set(e.pointerId, {
          x: e.clientX,
          y: e.clientY,
        });

        if (wasTracking !== 1) return;

        if (nodeTouchDragRef?.current) {
          nodeTouchDragRef.current.cancel?.();
        }
        startPinchGesture();
        e.stopPropagation();
      };

      window.addEventListener("pointerdown", onPointerDownCapture, true);
      return () =>
        window.removeEventListener("pointerdown", onPointerDownCapture, true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeTouchDragRef]);

    const handleViewportPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        target?.closest?.(".MuiCard-root") ||
        target?.closest?.("button") ||
        target?.closest?.("[data-handle-type]")
      )
        return;

      const isTouch = e.pointerType === "touch";
      const isPan = isTouch || e.button === 0;
      if (!isPan) return;

      activePointersRef.current.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
      });

      if (activePointersRef.current.size >= 2) {
        startPinchGesture();
        return;
      }

      if (isTouch && nodeTouchDragRef?.current) return;

      const startX = e.clientX;
      const startY = e.clientY;
      didDragRef.current = false;

      if (e.button === 0) clearSelection();

      startPanGesture(startX, startY);
    };

    const pendingFrameRef = useRef<number | null>(null);

    useEffect(() => {
      const applyPinchOrPan = (e: PointerEvent) => {
        if (gestureModeRef.current === "pinch") {
          const points = [...activePointersRef.current.values()];
          const pinchState = pinchStateRef.current as {lastDistance: number; lastMidpoint: Point} | null;
          if (points.length < 2 || !pinchState) return;

          const nextDistance = getTouchDistance(points[0], points[1]);
          const nextMidpoint = getTouchMidpoint(points[0], points[1]);
          const { lastDistance, lastMidpoint } = pinchState;

          const distanceDelta =
            lastDistance > 0
              ? Math.abs(nextDistance - lastDistance) / lastDistance
              : 0;
          const withinDeadzone = lastDistance > 0 && distanceDelta <= 0.003;
          const scaleFactor = withinDeadzone
            ? 1
            : lastDistance > 0
            ? nextDistance / lastDistance
            : 1;
          const nextZoom = clampZoom(zoomRef.current * scaleFactor);

          const containerRect = containerRef.current?.getBoundingClientRect();
          const originX = containerRect
            ? containerRect.left + containerRect.width / 2
            : 0;
          const originY = containerRect
            ? containerRect.top + containerRect.height / 2
            : 0;

          const nextOffset = computePinchZoomOffset({
            prevZoom: zoomRef.current,
            nextZoom,
            offset: offsetRef.current,
            prevMidpoint: {
              x: lastMidpoint.x - originX,
              y: lastMidpoint.y - originY,
            },
            nextMidpoint: {
              x: nextMidpoint.x - originX,
              y: nextMidpoint.y - originY,
            },
          });

          setZoom(nextZoom);
          setOffset(nextOffset);
          pinchStateRef.current = {
            lastDistance: withinDeadzone ? lastDistance : nextDistance,
            lastMidpoint: nextMidpoint,
          };
          return;
        }

        if (gestureModeRef.current === "pan") {
          const panState = pinchStateRef.current as {panStartX: number; panStartY: number; panStartOffset: Point} | null;
          if (!panState) return;
          const { panStartX, panStartY, panStartOffset } = panState;
          const dx = e.clientX - panStartX;
          const dy = e.clientY - panStartY;

          const tolerance =
            e.pointerType === "touch" ? LONG_PRESS_MOVE_TOLERANCE : 3;
          if (!didDragRef.current && Math.hypot(dx, dy) > tolerance) {
            didDragRef.current = true;
          }

          setOffset({
            x: panStartOffset.x + dx,
            y: panStartOffset.y + dy,
          });
        }
      };

      const onWindowPointerMove = (e: PointerEvent) => {
        if (!activePointersRef.current.has(e.pointerId)) return;
        activePointersRef.current.set(e.pointerId, {
          x: e.clientX,
          y: e.clientY,
        });

        if (gestureModeRef.current !== "pinch") {
          applyPinchOrPan(e);
          return;
        }

        if (pendingFrameRef.current) return;
        pendingFrameRef.current = requestAnimationFrame(() => {
          pendingFrameRef.current = null;
          applyPinchOrPan(e);
        });
      };

      const endPointer = (e: PointerEvent) => {
        if (pendingFrameRef.current) {
          cancelAnimationFrame(pendingFrameRef.current);
          pendingFrameRef.current = null;
        }
        activePointersRef.current.delete(e.pointerId);

        if (activePointersRef.current.size >= 2) return;

        if (activePointersRef.current.size === 1) {
          if (gestureModeRef.current === "pinch") {
            const [remaining] = [...activePointersRef.current.values()];
            startPanGesture(remaining.x, remaining.y);
          }
          return;
        }

        setIsDragging(false);
        gestureModeRef.current = null;
        pinchStateRef.current = null;
      };

      window.addEventListener("pointermove", onWindowPointerMove);
      window.addEventListener("pointerup", endPointer);
      window.addEventListener("pointercancel", endPointer);

      return () => {
        window.removeEventListener("pointermove", onWindowPointerMove);
        window.removeEventListener("pointerup", endPointer);
        window.removeEventListener("pointercancel", endPointer);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const onClickCapture = (e: MouseEvent) => {
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
        onPointerDown={handleViewportPointerDown}
        onContextMenu={(e) => {
          const isMouseRightClick =
            e.button === 2 || (e.nativeEvent as MouseEvent)?.button === 2;
          if (!isMouseRightClick) e.preventDefault();
        }}
        sx={{
          width: "100%",
          height: height,
          overflow: "hidden",
          bgcolor: "none",
          cursor: isDragging ? "grabbing" : "default",
          userSelect: "none",
          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
          position: "relative",
        }}
      >
        <Box
          ref={innerRef}
          data-flow-dragging={isDragging}
          sx={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            willChange: "transform",
            width: "100%",
            height: height,
            display: "flex",
            alignItems: "center",
            justifyContent:
              centered || (!usesFitView && shouldCenter)
                ? "center"
                : "flex-start",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            pointerEvents: isDragging ? "none" : "auto",
            position: "relative",
            pl:
              centered || (!usesFitView && shouldCenter)
                ? 0
                : variant === "horizontal"
                ? 4
                : 0,
          }}
        >
          {children}
          {showImpliedConnections && (
            <ImpliedConnections
              containerEl={innerRef.current}
              bindings={impliedConnections}
              labelForBinding={labelForImpliedConnection}
              tick={`${offset.x},${offset.y},${zoom}`}
            />
          )}
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
  }
);

export default FlowViewport;
