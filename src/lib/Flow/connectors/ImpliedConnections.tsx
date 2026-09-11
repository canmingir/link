import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { useTheme } from "@mui/material/styles";

import { collectHandles, handleKey } from "./handleAttrs";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.max(40, Math.abs(x2 - x1) / 2);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export interface ImpliedBinding {
  sourceNodeId: string;
  targetNodeId: string;
  field: string;
}

interface ImpliedConnectionsProps {
  containerEl?: HTMLElement | null;
  bindings?: ImpliedBinding[];
  labelForBinding?: (binding: ImpliedBinding) => ReactNode;
  stroke?: string;
  strokeWidth?: number;
  tick?: number | string;
}

interface ImpliedPath {
  id: string;
  d: string;
  title: ReactNode;
}

interface ImpliedState {
  paths: ImpliedPath[];
  dims: { w: number; h: number } | null;
}

const ImpliedConnections = ({
  containerEl,
  bindings = [],
  labelForBinding,
  stroke,
  strokeWidth = 1.5,
  tick = 0,
}: ImpliedConnectionsProps) => {
  const theme = useTheme();
  const [state, setState] = useState<ImpliedState>({ paths: [], dims: null });
  const rootRef = useRef<HTMLDivElement | null>(null);

  const lineColor = stroke ?? theme.palette.action.disabled;

  const bindingsKey = useMemo(() => JSON.stringify(bindings), [bindings]);

  const labelRef =
    useRef<ImpliedConnectionsProps["labelForBinding"]>(labelForBinding);
  labelRef.current = labelForBinding;

  useLayoutEffect(() => {
    const container = (containerEl ||
      rootRef.current?.offsetParent ||
      rootRef.current?.parentElement) as HTMLElement | null;

    if (!container || !bindings.length) {
      setState({ paths: [], dims: null });
      return;
    }

    const update = () => {
      const cRect = container.getBoundingClientRect();
      const scaleX = container.offsetWidth
        ? cRect.width / container.offsetWidth || 1
        : 1;
      const scaleY = container.offsetHeight
        ? cRect.height / container.offsetHeight || 1
        : 1;

      const handles = collectHandles(container);
      const paths: ImpliedPath[] = [];

      for (const b of bindings) {
        const sourceEl = handles.get(handleKey("out", b.sourceNodeId, b.field));
        const targetEl = handles.get(handleKey("in", b.targetNodeId, b.field));
        if (!sourceEl || !targetEl) continue;

        const s = sourceEl.getBoundingClientRect();
        const t = targetEl.getBoundingClientRect();

        const x1 = (s.right - cRect.left) / scaleX;
        const y1 = (s.top + s.height / 2 - cRect.top) / scaleY;
        const x2 = (t.left - cRect.left) / scaleX;
        const y2 = (t.top + t.height / 2 - cRect.top) / scaleY;

        paths.push({
          id: `${b.sourceNodeId}:${b.targetNodeId}:${b.field}`,
          d: bezierPath(x1, y1, x2, y2),
          title: labelRef.current
            ? labelRef.current(b)
            : `"${b.field}" flows by matching name`,
        });
      }

      setState({
        paths,
        dims: { w: cRect.width / scaleX, h: cRect.height / scaleY },
      });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerEl, bindingsKey, tick]);

  if (!state.dims || !state.paths.length) {
    return (
      <Box
        ref={rootRef}
        aria-hidden
        sx={{
          position: "absolute",
          width: 0,
          height: 0,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <Box
      ref={rootRef}
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${state.dims.w} ${state.dims.h}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {state.paths.map((p) => (
          <g key={p.id}>
            <path
              d={p.d}
              fill="none"
              stroke={lineColor}
              strokeWidth={strokeWidth}
              strokeDasharray="2 4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={p.d}
              fill="none"
              stroke="transparent"
              strokeWidth={12}
              style={{ pointerEvents: "auto", cursor: "help" }}
            >
              <title>{p.title}</title>
            </path>
          </g>
        ))}
      </svg>
    </Box>
  );
};

export default ImpliedConnections;
