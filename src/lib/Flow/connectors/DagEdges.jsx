import { Box } from "@mui/material";

import React, { useId, useMemo } from "react";

import { toPxNumber } from "../styles";

const anchorsFor = (sourceBox, targetBox, isHorizontal, tailInset, headInset) => {
  if (isHorizontal) {
    const from = {
      x: sourceBox.x + sourceBox.width + tailInset,
      y: sourceBox.y + sourceBox.height / 2,
    };
    const to = {
      x: Math.max(targetBox.x - headInset, from.x),
      y: targetBox.y + targetBox.height / 2,
    };
    return { from, to };
  }

  const from = {
    x: sourceBox.x + sourceBox.width / 2,
    y: sourceBox.y + sourceBox.height + tailInset,
  };
  const to = {
    x: targetBox.x + targetBox.width / 2,
    y: Math.max(targetBox.y - headInset, from.y),
  };
  return { from, to };
};

const buildPath = (from, to, { connectorType, curvature, isHorizontal }) => {
  const isCornered = connectorType === "cornered" || connectorType === "normal";

  if (isCornered) {
    if (isHorizontal) {
      const midX = from.x + (to.x - from.x) / 2;
      return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
    }
    const midY = from.y + (to.y - from.y) / 2;
    return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
  }

  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const baseCurvature = Math.max(40, Math.min(distance * curvature, 150));

  if (isHorizontal) {
    return `M ${from.x} ${from.y} C ${from.x + baseCurvature} ${from.y}, ${
      to.x - baseCurvature
    } ${to.y}, ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + baseCurvature}, ${to.x} ${
    to.y - baseCurvature
  }, ${to.x} ${to.y}`;
};

const getDashArray = (lineStyle, strokeWidth) => {
  if (lineStyle === "dashed") return `${strokeWidth * 4},${strokeWidth * 3}`;
  if (lineStyle === "dotted") return `${strokeWidth},${strokeWidth * 2}`;
  return undefined;
};

const DagEdges = ({
  edges = [],
  boxes,
  bounds,
  orientation = "horizontal",
  baseEdgeProps,
  resolveEdgeProps,
}) => {
  const uniqueId = useId();
  const isHorizontal = orientation === "horizontal";

  const resolved = useMemo(() => {
    const out = [];

    for (const edge of edges) {
      const sourceBox = boxes?.[edge.source];
      const targetBox = boxes?.[edge.target];
      if (!sourceBox || !targetBox) continue;

      const props = {
        ...baseEdgeProps,
        ...(resolveEdgeProps?.(edge) ?? {}),
      };

      const strokeWidth = toPxNumber(props.lineWidth, 2);
      const showArrow = props.showArrow ?? true;
      const arrowSize = props.arrowSize ?? 6;
      const headRoom = showArrow ? arrowSize * strokeWidth * 0.5 : 0;

      const { from, to } = anchorsFor(
        sourceBox,
        targetBox,
        isHorizontal,
        props.startGap ?? 8,
        (props.endGap ?? 10) + headRoom,
      );

      const d = buildPath(from, to, {
        connectorType: props.connectorType ?? "curved",
        curvature: props.curvature ?? 0.5,
        isHorizontal,
      });

      out.push({
        id: edge.id ?? `${edge.source}:${edge.target}`,
        d,
        from,
        to,
        strokeWidth,
        showArrow,
        arrowSize,
        stroke: props.lineColor ?? "#b1b1b7",
        lineStyle: props.lineStyle ?? "solid",
        animated: props.animated ?? false,
        animationSpeed: props.animationSpeed ?? 1,
        gradient: props.gradient ?? null,
        showDots: props.showDots ?? false,
        dotRadius: props.dotRadius ?? 4,
        dotColor: props.dotColor,
        label: props.label,
        labelStyle: props.labelStyle ?? {},
        labelPosition: props.labelPosition ?? 0.5,
        labelOffsetX: props.labelOffsetX ?? 0,
        labelOffsetY: props.labelOffsetY ?? -10,
      });
    }

    return out;
  }, [edges, boxes, isHorizontal, baseEdgeProps, resolveEdgeProps]);

  const hasAnimated = resolved.some((e) => e.animated);

  if (!bounds || !resolved.length) return null;

  return (
    <>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 2,
        }}
        width={bounds.width}
        height={bounds.height}
        viewBox={`0 0 ${bounds.width} ${bounds.height}`}
      >
        <defs>
          {hasAnimated && (
            <style>{`
              @keyframes flowAnimation {
                from { stroke-dashoffset: 24; }
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          )}

          {resolved.map((e) =>
            e.gradient ? (
              <linearGradient
                key={`grad-${e.id}`}
                id={`dag-grad-${uniqueId}-${e.id}`}
                gradientUnits="userSpaceOnUse"
                x1={e.from.x}
                y1={e.from.y}
                x2={e.to.x}
                y2={e.to.y}
              >
                <stop offset="0%" stopColor={e.gradient.from} />
                <stop offset="100%" stopColor={e.gradient.to} />
              </linearGradient>
            ) : null,
          )}

          {resolved.map((e) =>
            e.showArrow ? (
              <marker
                key={`arrow-${e.id}`}
                id={`dag-arrow-${uniqueId}-${e.id}`}
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth={e.arrowSize}
                markerHeight={e.arrowSize}
                orient="auto-start-reverse"
              >
                <path
                  d="M 0.5 1 L 10 5 L 0.5 9 Z"
                  fill={
                    e.gradient ? `url(#dag-grad-${uniqueId}-${e.id})` : e.stroke
                  }
                  stroke={
                    e.gradient ? `url(#dag-grad-${uniqueId}-${e.id})` : e.stroke
                  }
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </marker>
            ) : null,
          )}
        </defs>

        {resolved.map((e) => {
          const dashArray = getDashArray(e.lineStyle, e.strokeWidth);
          const pathStroke = e.gradient
            ? `url(#dag-grad-${uniqueId}-${e.id})`
            : e.stroke;
          const effectiveDotColor = e.dotColor || e.stroke;

          return (
            <g key={e.id}>
              <path
                d={e.d}
                fill="none"
                stroke={pathStroke}
                strokeWidth={e.strokeWidth}
                strokeDasharray={e.animated ? "8,4" : dashArray}
                strokeLinecap={dashArray || e.animated ? "round" : "butt"}
                strokeLinejoin="round"
                markerEnd={
                  e.showArrow ? `url(#dag-arrow-${uniqueId}-${e.id})` : undefined
                }
                style={{
                  transition: "stroke 0.2s ease, stroke-width 0.2s ease",
                  ...(e.animated
                    ? {
                        animation: `flowAnimation ${
                          0.5 / e.animationSpeed
                        }s linear infinite`,
                      }
                    : {}),
                }}
              />

              {e.showDots && (
                <>
                  <circle
                    cx={e.from.x}
                    cy={e.from.y}
                    r={e.dotRadius}
                    fill={e.gradient ? e.gradient.from : effectiveDotColor}
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
                  />
                  {!e.showArrow && (
                    <circle
                      cx={e.to.x}
                      cy={e.to.y}
                      r={e.dotRadius}
                      fill={e.gradient ? e.gradient.to : effectiveDotColor}
                      stroke="#fff"
                      strokeWidth={1.5}
                      style={{
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                      }}
                    />
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>

      {resolved.map((e) => {
        if (!e.label) return null;

        const labelX =
          e.from.x + (e.to.x - e.from.x) * e.labelPosition + e.labelOffsetX;
        const labelY =
          e.from.y + (e.to.y - e.from.y) * e.labelPosition + e.labelOffsetY;

        return (
          <Box
            key={`label-${e.id}`}
            sx={{
              position: "absolute",
              left: labelX,
              top: labelY,
              transform: "translate(-50%, -50%)",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: "background.paper",
              border: 1,
              borderColor: e.labelStyle.color || e.stroke,
              fontSize: e.labelStyle.fontSize || "12px",
              fontWeight: e.labelStyle.fontWeight || 600,
              color: e.labelStyle.textColor || e.stroke,
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 10,
              boxShadow: 1,
              whiteSpace: "nowrap",
            }}
          >
            {e.label}
          </Box>
        );
      })}
    </>
  );
};

export default DagEdges;
