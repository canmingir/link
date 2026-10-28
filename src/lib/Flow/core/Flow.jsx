import { Box, alpha } from "@mui/material";
import React, { forwardRef, useMemo, useState } from "react";
import { assertLinkedGraph, buildTreeFromLinked } from "../utils/flowUtils";

import FlowNode from "./FlowNode";
import { useDagLayout } from "../hooks/useDagLayout";
import { useGraphOperations } from "../hooks/useGraphOperations";

export const Flow = forwardRef(function Flow(
  {
    data,
    variant = "simple",
    style,
    plugin,
    editable = false,
    onChange,
    height,
    initialZoom,
    centered = false,
    minZoom,
    maxZoom,
    fitViewPadding,
    fitViewMinZoom,
    fitViewMaxZoom,
    fitViewAlign,
    fitViewOnMount,
    fitViewOnResize,
    fitViewOnNodesChange,
    onInit,
    impliedConnections,
    showImpliedConnections = false,
    labelForImpliedConnection,
    onConnectRejected,
    layout = "tree",
    layoutDirection = "RIGHT",
    positions,
    layoutEdges,
    layoutBounds,
    onLayoutError,
  },
  ref,
) {
  const [floatingNodes, setFloatingNodes] = useState([]);

  const isDag = layout === "dag";

  const { nodesById, roots } = useMemo(() => assertLinkedGraph(data), [data]);

  const dagLayout = useDagLayout({
    nodesById,
    enabled: isDag,
    direction: layoutDirection,
    variant,
    style,
    plugin,
    positions,
    layoutEdges,
    layoutBounds,
    onLayoutError,
  });

  const { handleCut, handlePaste, handleConnect } = useGraphOperations({
    nodesById,
    roots,
    onChange,
    floatingNodes,
    setFloatingNodes,
    editable,
    onConnectRejected,
  });

  const allNodesById = useMemo(() => {
    if (!floatingNodes.length) return nodesById;

    const merged = { ...nodesById };

    for (const structure of floatingNodes) {
      if (structure?.nodes) {
        Object.assign(merged, structure.nodes);
      }
    }

    return merged;
  }, [nodesById, floatingNodes]);

  const treeData = useMemo(() => {
    if (isDag) return null;
    if (!roots?.length) return null;

    if (roots.length === 1) {
      return (
        buildTreeFromLinked(roots[0], nodesById) || {
          id: roots[0],
          children: [],
        }
      );
    }

    const children = roots
      .map((r) => buildTreeFromLinked(r, nodesById))
      .filter(Boolean);

    return children.length > 0
      ? { id: "__root__", label: "Start", virtual: true, children }
      : null;
  }, [isDag, nodesById, roots]);

  return (
    <Box
      sx={{
        height,
        flexShrink: 0,
        backgroundImage: (theme) => `
                          radial-gradient(
                            ${alpha(theme.palette.divider, 0.08)} 1px,
                            transparent 1px
                          )
                        `,
        backgroundSize: "16px 16px",
      }}
    >
      <FlowNode
        ref={ref}
        node={treeData}
        variant={variant}
        style={style}
        plugin={plugin}
        isRoot={true}
        nodesById={allNodesById}
        onPaste={editable ? handlePaste : undefined}
        onCut={editable ? handleCut : undefined}
        onConnect={editable ? handleConnect : undefined}
        floatingNodes={floatingNodes}
        height={height}
        initialZoom={initialZoom}
        centered={centered}
        minZoom={minZoom}
        maxZoom={maxZoom}
        fitViewPadding={fitViewPadding}
        fitViewMinZoom={fitViewMinZoom}
        fitViewMaxZoom={fitViewMaxZoom}
        fitViewAlign={fitViewAlign}
        fitViewOnMount={fitViewOnMount}
        fitViewOnResize={fitViewOnResize}
        fitViewOnNodesChange={fitViewOnNodesChange}
        onInit={onInit}
        impliedConnections={impliedConnections}
        showImpliedConnections={showImpliedConnections}
        labelForImpliedConnection={labelForImpliedConnection}
        layout={layout}
        positions={dagLayout?.positions}
        layoutEdges={dagLayout?.edges}
        layoutBounds={dagLayout?.bounds}
      />
    </Box>
  );
});

export default Flow;
