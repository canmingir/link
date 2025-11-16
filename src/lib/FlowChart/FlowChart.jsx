import FlowNode from "./FlowNode";

import React, { useMemo } from "react";
import { assertLinkedGraph, buildTreeFromLinked } from "./graph";

export const FlowChart = ({
  type = "default",
  data,
  variant = "simple",
  style,
}) => {
  const { nodesById, roots } = useMemo(() => assertLinkedGraph(data), [data]);

  const treeData = useMemo(() => {
    if (!roots?.length)
      return { id: "__empty__", label: "(empty)", children: [] };

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

    return { id: "__root__", label: "Root", children };
  }, [nodesById, roots]);

  return (
    <FlowNode node={treeData} type={type} variant={variant} style={style} />
  );
};

export default FlowChart;
