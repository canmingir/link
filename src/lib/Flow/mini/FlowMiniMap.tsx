import { Box } from "@mui/material";
import { FlowSvgContent } from "./FlowSvgContent";
import type { MiniLayout } from "./layoutFlow";
import type { MiniSvgNode } from "./FlowSvgContent";
import type { ResolveNodeVisualArgs } from "./resolveNodeVisual";
import { layoutFlow } from "./layoutFlow";

import type { MouseEvent as ReactMouseEvent, RefObject } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";

const MINIMAP_W = 300;

interface Point {
  x: number;
  y: number;
}

interface ViewportRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ViewportInfo {
  rect: ViewportRect;
  scaleX: number;
  scaleY: number;
}

function computeViewportInfo(
  containerEl: HTMLElement,
  positions: MiniLayout["positions"]
): ViewportInfo | null {
  const containerRect = containerEl.getBoundingClientRect();
  const nodeEls = containerEl.querySelectorAll("[data-node-id]");

  const pairs: { screen: Point; mini: Point }[] = [];

  nodeEls.forEach((el: Element) => {
    const id = el.getAttribute("data-node-id");
    if (!id || !positions[id]) return;
    const rect = el.getBoundingClientRect();
    pairs.push({
      screen: {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
      },
      mini: positions[id],
    });
  });

  if (pairs.length < 2) return null;

  const p1 = pairs[0];
  const p2 = pairs[1];
  const dsx = p2.screen.x - p1.screen.x;
  const dsy = p2.screen.y - p1.screen.y;
  const dmx = p2.mini.x - p1.mini.x;
  const dmy = p2.mini.y - p1.mini.y;

  const scaleX =
    Math.abs(dsx) > 1 ? dmx / dsx : Math.abs(dsy) > 1 ? dmy / dsy : null;
  const scaleY =
    Math.abs(dsy) > 1 ? dmy / dsy : Math.abs(dsx) > 1 ? dmx / dsx : null;

  if (scaleX === null || scaleY === null) return null;

  const offsetX = p1.mini.x - p1.screen.x * scaleX;
  const offsetY = p1.mini.y - p1.screen.y * scaleY;

  return {
    rect: {
      x: offsetX,
      y: offsetY,
      w: containerRect.width * scaleX,
      h: containerRect.height * scaleY,
    },
    scaleX,
    scaleY,
  };
}

interface FlowMiniMapProps {
  nodes?: MiniSvgNode[];
  flowContainerRef: RefObject<HTMLElement | null>;
  type?: string;
  variant?: string;
  style?: ResolveNodeVisualArgs["style"];
  plugin?: ResolveNodeVisualArgs["plugin"];
}

export function FlowMiniMap({
  nodes,
  flowContainerRef,
  type,
  variant,
  style,
  plugin,
}: FlowMiniMapProps) {
  const theme = useTheme();
  const rafRef = useRef(0);
  const viewportInfoRef = useRef<ViewportInfo | null>(null);
  const [viewportRect, setViewportRect] = useState<ViewportRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<Point | null>(null);

  const rawNodes = useMemo(() => nodes ?? [], [nodes]);

  const { positions, edgeList, svgW, svgH } = useMemo(
    () => layoutFlow(rawNodes),
    [rawNodes]
  );

  useEffect(() => {
    const container = flowContainerRef.current;
    if (!container) return;

    const tick = () => {
      const info = computeViewportInfo(container, positions);
      viewportInfoRef.current = info;
      setViewportRect(info?.rect ?? null);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flowContainerRef, positions]);

  useEffect(
    () => {
      if (!isDragging) return;

      const container = flowContainerRef.current;

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragStartRef.current || !viewportInfoRef.current) return;

        const dx_css = e.clientX - dragStartRef.current.x;
        const dy_css = e.clientY - dragStartRef.current.y;

        const minimapH = (MINIMAP_W * svgH) / svgW;
        const svgScaleX = svgW / MINIMAP_W;
        const svgScaleY = svgH / minimapH;
        const dx_flow = (dx_css * svgScaleX) / viewportInfoRef.current.scaleX;
        const dy_flow = (dy_css * svgScaleY) / viewportInfoRef.current.scaleY;

        if (container && (Math.abs(dx_flow) > 0.5 || Math.abs(dy_flow) > 0.5)) {
          const target = container.querySelector("[data-node-id]") ?? container;
          target.dispatchEvent(
            new WheelEvent("wheel", {
              bubbles: true,
              cancelable: true,
              deltaMode: 0,
              deltaX: dx_flow,
              deltaY: dy_flow,
            })
          );
        }

        dragStartRef.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        if (container) {
          container.style.pointerEvents = "";
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        if (container) container.style.pointerEvents = "";
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDragging, svgW, flowContainerRef]
  );

  const handleViewportMouseDown = (e: ReactMouseEvent<SVGRectElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    if (flowContainerRef.current) {
      flowContainerRef.current.style.pointerEvents = "none";
    }
  };

  const dotColor = alpha(theme.palette.divider, 0.12);

  if (!rawNodes.length || svgW === 0) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        left: 16,
        width: MINIMAP_W,
        height: 55,
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: alpha(theme.palette.background.paper, 0.9),
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: "12px 12px",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        overflow: "hidden",
        zIndex: 10,
        cursor: isDragging ? "grabbing" : "default",
        userSelect: "none",
      }}
    >
      <FlowSvgContent
        nodes={rawNodes}
        positions={positions}
        edgeList={edgeList}
        svgW={svgW}
        svgH={svgH}
        uid="minimap"
        viewportRect={viewportRect}
        onViewportMouseDown={handleViewportMouseDown}
        isDragging={isDragging}
        type={type}
        variant={variant}
        style={style}
        plugin={plugin}
      />
    </Box>
  );
}

export default FlowMiniMap;
