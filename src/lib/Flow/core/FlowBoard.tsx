import FlowBoardItem from "./FlowBoardItem";
import FlowViewport from "./FlowViewport";
import { SelectionProvider } from "../selection/SelectionContext";
import { getBaseStyleForVariant } from "../styles";

import type {
  FitAlign,
  FlowNodeMap,
  FlowViewportHandle,
  Point,
} from "../types";
import type { FlowPluginArg, FlowStyleResolver } from "../hooks/useNodeStyle";
import { ReactNode, forwardRef, useMemo } from "react";

/** One flow in a board: a linked-graph plus board-level placement metadata. */
export interface BoardFlow {
  id?: string;
  label?: ReactNode;
  divider?: ReactNode;
  variant?: string;
  position?: Point;
  nodes?: FlowNodeMap;
  roots?: string[];
}

export interface FlowBoardProps {
  flows?: BoardFlow[];
  variant?: string;
  style?: FlowStyleResolver;
  plugin?: FlowPluginArg;
  initialZoom?: number;
  height?: number | string;
  gap?: number;
  onFlowPositionChange?: (flowId: string | number, position: Point) => void;
  minZoom?: number;
  maxZoom?: number;
  fitViewPadding?: number;
  fitViewMinZoom?: number;
  fitViewMaxZoom?: number;
  fitViewAlign?: FitAlign;
  fitViewOnMount?: boolean;
  fitViewOnResize?: boolean;
  fitViewOnNodesChange?: boolean;
  onInit?: (handle: FlowViewportHandle) => void;
}

export const FlowBoard = forwardRef<FlowViewportHandle, FlowBoardProps>(
  function FlowBoard(
    {
      flows = [],
      variant = "simple",
      style,
      plugin,
      initialZoom = 1,
      height = "100vh",
      gap = 480,
      onFlowPositionChange,
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
    },
    ref
  ) {
    const baseStyle = getBaseStyleForVariant(variant);
    const selectionColor = baseStyle.selectionColor ?? "#64748b";

    const positionedFlows = useMemo(() => {
      const count = flows.length;
      return flows.map((flow, index: number) => {
        const fallback = {
          x: (index - (count - 1) / 2) * gap,
          y: 0,
        };
        return {
          flow,
          id: flow?.id ?? index,
          position: flow?.position ?? fallback,
        };
      });
    }, [flows, gap]);

    const mergedNodesById = useMemo(() => {
      const merged: FlowNodeMap = {};
      for (const { flow } of positionedFlows) {
        if (flow?.nodes) Object.assign(merged, flow.nodes);
      }
      return merged;
    }, [positionedFlows]);

    return (
      <SelectionProvider>
        <FlowViewport
          ref={ref}
          selectionColor={selectionColor}
          nodesById={mergedNodesById}
          variant={variant}
          style={style}
          plugin={plugin}
          height={height}
          initialZoom={initialZoom}
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
        >
          {positionedFlows.map(({ flow, id, position }) => (
            <FlowBoardItem
              key={id}
              flow={flow}
              flowId={id}
              label={flow?.label}
              divider={flow?.divider}
              position={position}
              onPositionChange={
                onFlowPositionChange
                  ? (pos: Point) => onFlowPositionChange(id, pos)
                  : undefined
              }
              variant={flow?.variant ?? variant}
              style={style}
              plugin={plugin}
            />
          ))}
        </FlowViewport>
      </SelectionProvider>
    );
  }
);

export default FlowBoard;
