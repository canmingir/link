import { Box } from "@mui/material";

import { FlowMiniMap, FlowSvgContent, layoutFlow } from "../lib/Flow";
import React, { useRef } from "react";

export default {
  title: "Components/FlowMiniMap",
  component: FlowMiniMap,
  parameters: {
    layout: "fullscreen",
  },
};

const sampleNodes = [
  {
    id: "start",
    type: "NORMAL",
    properties: { label: "Start", action: "PLATFORM:BEGIN", icon: "mdi:play" },
    next: ["check"],
  },
  {
    id: "check",
    type: "CONDITION",
    properties: { label: "Is valid?", icon: "mdi:help-circle-outline" },
    true: ["approve"],
    false: ["reject"],
  },
  {
    id: "approve",
    type: "NORMAL",
    properties: { label: "Approve", action: "SYSTEM:APPROVE" },
    next: ["done"],
  },
  {
    id: "reject",
    type: "NORMAL",
    properties: { label: "Reject", action: "SYSTEM:REJECT" },
    next: ["done"],
  },
  {
    id: "done",
    type: "NORMAL",
    properties: { label: "Done", action: "PLATFORM:END" },
  },
];

export const SvgContentOnly = {
  render: () => {
    const { positions, edgeList, svgW, svgH } = layoutFlow(sampleNodes);
    return (
      <Box sx={{ width: 480, height: 300, p: 2 }}>
        <FlowSvgContent
          nodes={sampleNodes}
          positions={positions}
          edgeList={edgeList}
          svgW={svgW}
          svgH={svgH}
          uid="story"
        />
      </Box>
    );
  },
};

export const MiniMapDemo = {
  render: () => {
    const flowContainerRef = useRef(null);
    return (
      <Box
        ref={flowContainerRef}
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <FlowMiniMap nodes={sampleNodes} flowContainerRef={flowContainerRef} />
      </Box>
    );
  },
};

const colorPlugin = {
  style: ({ node }) => {
    if (node.type === "CONDITION") return { bg: "#f59e0b" };
    const action = node.properties?.action || "";
    if (/BEGIN|START/i.test(action)) return { bg: "#22c55e" };
    if (/REJECT/i.test(action)) return { bg: "#ef4444" };
    if (/APPROVE/i.test(action)) return { bg: "#3b82f6" };
    if (/END/i.test(action)) return { bg: "#64748b" };
    return {};
  },
};

export const MiniMapWithPlugin = {
  render: () => {
    const flowContainerRef = useRef(null);
    return (
      <Box
        ref={flowContainerRef}
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <FlowMiniMap
          nodes={sampleNodes}
          flowContainerRef={flowContainerRef}
          plugin={colorPlugin}
        />
      </Box>
    );
  },
};
