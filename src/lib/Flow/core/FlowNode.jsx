import FlowNodeView from "../nodes/FlowNodeView";
import FlowViewport from "./FlowViewport";
import React from "react";
import { SelectionProvider } from "../selection/SelectionContext";
import { getBaseStyleForVariant } from "../styles";

const FlowNode = ({
  isRoot = false,
  onAddNode,
  variant,
  nodesById,
  onPaste,
  onCut,
  onConnect,
  floatingNodes,
  style,
  plugin,
  node,
  height,
  initialZoom,
  ...props
}) => {
  if (!isRoot) {
    if (!node) return null;
    return (
      <FlowNodeView
        node={node}
        onAddNode={onAddNode}
        variant={variant}
        style={style}
        plugin={plugin}
        onConnect={onConnect}
        {...props}
      />
    );
  }

  const baseStyle = getBaseStyleForVariant(variant);
  const selectionColor = baseStyle.selectionColor ?? "#64748b";

  return (
    <SelectionProvider>
      <FlowViewport
        selectionColor={selectionColor}
        nodesById={nodesById}
        onPaste={onPaste}
        onCut={onCut}
        onConnect={onConnect}
        floatingNodes={floatingNodes}
        variant={variant}
        style={style}
        plugin={plugin}
        height={height}
        initialZoom={initialZoom}
      >
        {node && (
          <FlowNodeView
            node={node}
            onAddNode={onAddNode}
            variant={variant}
            style={style}
            plugin={plugin}
            onConnect={onConnect}
            {...props}
          />
        )}
      </FlowViewport>
    </SelectionProvider>
  );
};

export default FlowNode;
