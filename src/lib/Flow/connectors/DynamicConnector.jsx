import React, { useId, useLayoutEffect, useMemo, useState } from "react";

const DynamicConnector = ({
  containerEl,
  parentEl,
  childEls,
  stroke = "#b1b1b7",
  strokeWidth = 2,
  lineStyle = "solid",
  tick = 0,
  orientation = "vertical",
  showDots = false,
  dotRadius = 4,
  dotColor,
  showArrow = true,
  arrowSize = 6,
  animated = false,
  animationSpeed = 1,
  gradient = null,
  curvature = 0.5,
  connectorType = "curved",
}) => {
  const uniqueId = useId();
  const [dims, setDims] = useState(null);
  const [points, setPoints] = useState({
    parent: null,
    children: [],
  });

  const isHorizontal = orientation === "horizontal";

  useLayoutEffect(() => {
    if (!containerEl || !parentEl || !childEls?.length) return;

    const update = () => {
      const cRect = containerEl.getBoundingClientRect();
      const pRect = parentEl.getBoundingClientRect();

      let parentPoint;
      let childPoints = [];

      if (isHorizontal) {
        parentPoint = {
          x: pRect.right - cRect.left,
          y: pRect.top + pRect.height / 2 - cRect.top,
        };

        childPoints = childEls.map((el) => {
          if (!el) return { x: parentPoint.x + 100, y: parentPoint.y };
          const r = el.getBoundingClientRect();
          return {
            x: r.left - cRect.left,
            y: r.top + r.height / 2 - cRect.top,
          };
        });
      } else {
        parentPoint = {
          x: pRect.left + pRect.width / 2 - cRect.left,
          y: pRect.bottom - cRect.top,
        };

        childPoints = childEls.map((el) => {
          if (!el) return { x: parentPoint.x, y: parentPoint.y + 100 };
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - cRect.left,
            y: r.top - cRect.top,
          };
        });
      }

      setPoints({ parent: parentPoint, children: childPoints });
      setDims({ w: cRect.width, h: cRect.height });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(containerEl);
    ro.observe(parentEl);
    childEls.forEach((el) => el && ro.observe(el));

    return () => ro.disconnect();
  }, [containerEl, parentEl, childEls, tick, isHorizontal]);

  const ids = useMemo(
    () => ({
      gradient: `gradient-${uniqueId}`,
      arrow: `arrow-${uniqueId}`,
    }),
    [uniqueId]
  );

  const getPath = (from, to) => {
    const isCornered =
      connectorType === "cornered" || connectorType === "normal";

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
      const cp1x = from.x + baseCurvature;
      const cp2x = to.x - baseCurvature;
      return `M ${from.x} ${from.y} C ${cp1x} ${from.y}, ${cp2x} ${to.y}, ${to.x} ${to.y}`;
    } else {
      const cp1y = from.y + baseCurvature;
      const cp2y = to.y - baseCurvature;
      return `M ${from.x} ${from.y} C ${from.x} ${cp1y}, ${to.x} ${cp2y}, ${to.x} ${to.y}`;
    }
  };

  const getDashArray = () => {
    if (lineStyle === "dashed") return `${strokeWidth * 4},${strokeWidth * 3}`;
    if (lineStyle === "dotted") return `${strokeWidth},${strokeWidth * 2}`;
    return undefined;
  };

  const animationStyle = animated
    ? `
    @keyframes flowAnimation {
      from { stroke-dashoffset: 24; }
      to { stroke-dashoffset: 0; }
    }
  `
    : "";

  if (!dims || !points.parent || !points.children.length) return null;

  const effectiveDotColor = dotColor || stroke;
  const dashArray = getDashArray();

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 0,
      }}
      width="100%"
      height="100%"
      viewBox={`0 0 ${dims.w} ${dims.h}`}
    >
      <defs>
        {gradient && (
          <linearGradient
            id={ids.gradient}
            gradientUnits="userSpaceOnUse"
            x1={points.parent.x}
            y1={points.parent.y}
            x2={points.children[0]?.x || points.parent.x}
            y2={points.children[0]?.y || points.parent.y}
          >
            <stop offset="0%" stopColor={gradient.from} />
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>
        )}

        {showArrow && (
          <marker
            id={ids.arrow}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth={arrowSize}
            markerHeight={arrowSize}
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill={gradient ? `url(#${ids.gradient})` : stroke}
            />
          </marker>
        )}

        {animated && <style>{animationStyle}</style>}
      </defs>

      {points.children.map((child, i) => {
        const pathD = getPath(points.parent, child);
        const pathStroke = gradient ? `url(#${ids.gradient})` : stroke;

        return (
          <g key={i}>
            <path
              d={pathD}
              fill="none"
              stroke={pathStroke}
              strokeWidth={strokeWidth}
              strokeDasharray={animated ? "8,4" : dashArray}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={showArrow ? `url(#${ids.arrow})` : undefined}
              style={{
                transition: "stroke 0.2s ease, stroke-width 0.2s ease",
                ...(animated
                  ? {
                      animation: `flowAnimation ${
                        0.5 / animationSpeed
                      }s linear infinite`,
                    }
                  : {}),
              }}
            />
          </g>
        );
      })}

      {showDots && (
        <>
          <circle
            cx={points.parent.x}
            cy={points.parent.y}
            r={dotRadius}
            fill={gradient ? gradient.from : effectiveDotColor}
            stroke="#fff"
            strokeWidth={1.5}
            style={{
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
            }}
          />

          {points.children.map((child, i) => {
            const dotFill = gradient ? gradient.to : effectiveDotColor;

            return (
              <circle
                key={i}
                cx={child.x}
                cy={child.y}
                r={dotRadius}
                fill={dotFill}
                stroke="#fff"
                strokeWidth={1.5}
                style={{
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                }}
              />
            );
          })}
        </>
      )}
    </svg>
  );
};

export default DynamicConnector;
