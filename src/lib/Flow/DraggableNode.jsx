import { Box } from "@mui/material";

import React, { useRef, useState } from "react";

const DraggableNode = ({ children, registerRef, onDrag }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const localRef = useRef(null);

  const setRef = (el) => {
    localRef.current = el;
    if (registerRef) registerRef(el);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startOffset = { ...offset };

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setOffset({
        x: startOffset.x + dx,
        y: startOffset.y + dy,
      });
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
      }}
    >
      {children}
    </Box>
  );
};

export default DraggableNode;
