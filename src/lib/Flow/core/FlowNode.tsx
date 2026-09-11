import type { FlowNodeData } from "../nodes/FlowNodeView";
import FlowNodeView from "../nodes/FlowNodeView";
import FlowViewport from "./FlowViewport";
import type { FlowViewportHandle } from "../types";
import type { FlowViewportProps } from "./FlowViewport";
import { SelectionProvider } from "../selection/SelectionContext";
import { forwardRef } from "react";
import { getBaseStyleForVariant } from "../styles";

export interface FlowNodeProps extends FlowViewportProps {
  isRoot?: boolean;
  node?: FlowNodeData | null;
  type?: string;
  onAddNode?: (...args: unknown[]) => void;
  onDrag?: (offset?: { x: number; y: number }) => void;
  registerRef?: (el: HTMLElement | null) => void;
}

const FlowNode = forwardRef<FlowViewportHandle, FlowNodeProps>(
  function FlowNode(
    {
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
      centered,
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
      showImpliedConnections,
      labelForImpliedConnection,
      ...props
    },
    ref
  ) {
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
          ref={ref}
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
  }
);

export default FlowNode;
