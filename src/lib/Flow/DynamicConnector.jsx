import React, { useLayoutEffect, useState } from "react";

const DynamicConnector = ({
  containerEl,
  parentEl,
  childEls,
  stroke,
  strokeWidth,
  lineStyle,
  connectorType = "default",
  tick = 0,
}) => {
  const [dims, setDims] = useState(null);
  const [points, setPoints] = useState({
    parent: null,
    children: [],
    yMid: null,
  });

  useLayoutEffect(() => {
    if (!containerEl || !parentEl || !childEls?.length) return;

    const update = () => {
      const cRect = containerEl.getBoundingClientRect();
      const pRect = parentEl.getBoundingClientRect();

      const parent = {
        x: pRect.left + pRect.width / 2 - cRect.left,
        y: pRect.bottom - cRect.top,
      };

      const children = childEls.map((el) => {
        if (!el) return { x: parent.x, y: parent.y };
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - cRect.left,
          y: r.top - cRect.top,
        };
      });

      const firstTop = Math.min(...children.map((c) => c.y));
      const yMid =
        parent.y + Math.max(12, Math.min(24, (firstTop - parent.y) * 0.4));

      setPoints({ parent, children, yMid });
      setDims({ w: cRect.width, h: cRect.height });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(containerEl);
    ro.observe(parentEl);
    childEls.forEach((el) => el && ro.observe(el));

    return () => ro.disconnect();
  }, [containerEl, parentEl, childEls, tick]);

  if (!dims || !points.parent || !points.children.length) return null;

  const dash =
    lineStyle === "dashed"
      ? `${strokeWidth * 3},${strokeWidth * 2}`
      : lineStyle === "dotted"
      ? `${strokeWidth},${strokeWidth * 1.5}`
      : undefined;

  const onlyOne = points.children.length === 1;

  const svgProps = {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      overflow: "visible",
    },
    width: "100%",
    height: "100%",
    viewBox: `0 0 ${dims.w} ${dims.h}`,
  };

  if (connectorType === "curved" || connectorType === "n8n") {
    const createN8nPath = (from, to) => {
      const v = Math.max(32, Math.abs(to.y - from.y) * 0.35);
      const h = Math.max(24, Math.abs(to.x - from.x) * 0.35);

      const c1 = {
        x: to.x > from.x ? from.x + h : from.x - h,
        y: from.y + v,
      };
      const c2 = {
        x: to.x > from.x ? to.x - h : to.x + h,
        y: to.y - v,
      };

      return `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
    };

    return (
      <svg {...svgProps}>
        {points.children.map((child, i) => (
          <path
            key={i}
            d={createN8nPath(points.parent, child)}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dash}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    );
  }

  return (
    <svg {...svgProps}>
      {onlyOne ? (
        <line
          x1={points.parent.x}
          y1={points.parent.y}
          x2={points.children[0].x}
          y2={points.children[0].y}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dash}
        />
      ) : (
        <>
          <line
            x1={points.parent.x}
            y1={points.parent.y}
            x2={points.parent.x}
            y2={points.yMid}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dash}
          />

          {(() => {
            const xs = points.children.map((c) => c.x);
            const xMin = Math.min(...xs, points.parent.x);
            const xMax = Math.max(...xs, points.parent.x);
            return (
              <line
                x1={xMin}
                y1={points.yMid}
                x2={xMax}
                y2={points.yMid}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dash}
              />
            );
          })()}

          {points.children.map((c, i) => (
            <line
              key={i}
              x1={c.x}
              y1={points.yMid}
              x2={c.x}
              y2={c.y}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={dash}
            />
          ))}
        </>
      )}
    </svg>
  );
};

export default DynamicConnector;
