import { Box } from "@mui/material";
import type { FloatingStructure } from "../hooks/useGraphOperations";
import FlowNodeView from "../nodes/FlowNodeView";
import type { TreeNode } from "../types";
import { buildDetachedTree } from "../utils/flowUtils";
import { useMemo } from "react";

import type { FlowPluginArg, FlowStyleResolver } from "../hooks/useNodeStyle";

interface FloatingGraphProps {
  structure?: FloatingStructure & { _pastePosition?: { x: number; y: number } };
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  selectionColor?: string;
  onConnect?: (nodeId: string, selectedIds: string[]) => void;
}

const FloatingGraph = ({
  structure,
  variant,
  style,
  plugin,
  onConnect,
}: FloatingGraphProps) => {
  const position = structure?._pastePosition || { x: 0, y: 0 };

  const treesData = useMemo<TreeNode[]>(() => {
    if (!structure?.roots?.length || !structure?.nodes) return [];
    return structure.roots
      .map((rootId) => buildDetachedTree(rootId, structure.nodes))
      .filter((t): t is TreeNode => Boolean(t));
  }, [structure]);

  if (!treesData.length) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(${position.x}px, ${position.y}px)`,
        display: "flex",
        gap: 2,
      }}
    >
      {treesData.map((tree, idx) => (
        <FlowNodeView
          key={tree.id || `floating-${idx}`}
          node={tree}
          variant={variant}
          style={style}
          plugin={plugin}
          onConnect={onConnect}
        />
      ))}
    </Box>
  );
};

export default FloatingGraph;
