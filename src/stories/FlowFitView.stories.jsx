import { Button, Stack } from "@mui/material";
import React, { useRef, useState } from "react";

import { Flow } from "../lib/Flow";

const treeToLinked = (tree) => {
  if (!tree) return { nodes: {}, roots: [] };

  const nodes = {};
  const roots = [];

  const walk = (node, parentId = null) => {
    if (!node || !node.id) return;

    const { children, ...rest } = node;
    if (!nodes[node.id]) {
      nodes[node.id] = { ...rest, id: node.id };
    }

    const kids = Array.isArray(children) ? children : [];
    const nextIds = kids.map((c) => c.id).filter(Boolean);

    if (nextIds.length === 1) {
      nodes[node.id].next = nextIds[0];
    } else if (nextIds.length > 1) {
      nodes[node.id].next = nextIds;
    }

    if (parentId) {
      nodes[node.id].previous = parentId;
    } else if (!roots.includes(node.id)) {
      roots.push(node.id);
    }

    kids.forEach((child) => walk(child, node.id));
  };

  walk(tree);
  return { nodes, roots };
};

export default {
  title: "Components/FlowFitView",
  component: Flow,
  parameters: {
    layout: "fullscreen",
  },
};

const wideTree = {
  id: "root",
  label: "Root",
  children: [
    {
      id: "branch1",
      label: "Branch 1",
      children: [
        { id: "leaf1-1", label: "Leaf 1.1", children: [] },
        { id: "leaf1-2", label: "Leaf 1.2", children: [] },
      ],
    },
    {
      id: "branch2",
      label: "Branch 2",
      children: [
        { id: "leaf2-1", label: "Leaf 2.1", children: [] },
        { id: "leaf2-2", label: "Leaf 2.2", children: [] },
        { id: "leaf2-3", label: "Leaf 2.3", children: [] },
      ],
    },
    {
      id: "branch3",
      label: "Branch 3",
      children: [{ id: "leaf3-1", label: "Leaf 3.1", children: [] }],
    },
  ],
};

export const FitViewDemo = {
  render: () => {
    const flowRef = useRef(null);
    const data = treeToLinked(wideTree);

    return (
      <Stack sx={{ height: "100vh" }}>
        <Stack direction="row" spacing={1} sx={{ p: 1 }}>
          <Button
            variant="contained"
            onClick={() => flowRef.current?.fitView()}
          >
            Fit View
          </Button>
          <Button variant="outlined" onClick={() => flowRef.current?.zoomIn()}>
            Zoom In
          </Button>
          <Button
            variant="outlined"
            onClick={() => flowRef.current?.zoomOut()}
          >
            Zoom Out
          </Button>
        </Stack>
        <Flow
          ref={flowRef}
          data={data}
          variant="simple"
          height="calc(100vh - 56px)"
          minZoom={0.25}
          maxZoom={2.5}
          fitViewPadding={60}
          fitViewMaxZoom={1}
          fitViewOnMount
        />
      </Stack>
    );
  },
};

export const FitViewOnNodesChangeDemo = {
  render: () => {
    const flowRef = useRef(null);
    const [tree, setTree] = useState(wideTree);
    const data = treeToLinked(tree);

    const addLeafToBranch1 = () => {
      setTree((prev) => {
        const branch1 = prev.children.find((c) => c.id === "branch1");
        const nextIndex = branch1.children.length + 1;
        const newLeaf = {
          id: `leaf1-${nextIndex}-${Date.now()}`,
          label: `Leaf 1.${nextIndex}`,
          children: [],
        };
        return {
          ...prev,
          children: prev.children.map((c) =>
            c.id === "branch1"
              ? { ...c, children: [...c.children, newLeaf] }
              : c,
          ),
        };
      });
    };

    return (
      <Stack sx={{ height: "100vh" }}>
        <Stack direction="row" spacing={1} sx={{ p: 1 }}>
          <Button variant="contained" onClick={addLeafToBranch1}>
            Add Node
          </Button>
          <Button
            variant="outlined"
            onClick={() => flowRef.current?.fitView()}
          >
            Fit View
          </Button>
        </Stack>
        <Flow
          ref={flowRef}
          data={data}
          variant="simple"
          height="calc(100vh - 56px)"
          minZoom={0.25}
          maxZoom={2.5}
          fitViewPadding={60}
          fitViewMaxZoom={1}
          fitViewOnMount
          fitViewOnNodesChange
        />
      </Stack>
    );
  },
};
