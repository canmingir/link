export function assertLinkedGraph(data) {
  if (!data || typeof data !== "object") {
    throw new Error(
      "FlowChart expected a linked graph object: { nodes, roots? }."
    );
  }
  const { nodes, roots } = data;
  if (!nodes || typeof nodes !== "object") {
    throw new Error("FlowChart expected data.nodes to be an object.");
  }

  let useRoots = Array.isArray(roots) ? [...roots] : null;
  if (!useRoots || useRoots.length === 0) {
    useRoots = Object.keys(nodes).filter((id) => !nodes[id]?.previous);
  }
  if (useRoots.length === 0) {
    const first = Object.keys(nodes)[0];
    if (first) useRoots = [first];
  }

  for (const r of useRoots) {
    if (!nodes[r]) throw new Error(`Root id "${r}" not found in data.nodes.`);
  }

  return { nodesById: nodes, roots: useRoots };
}

export function buildTreeFromLinked(rootId, nodesById) {
  if (!rootId || !nodesById?.[rootId]) return null;
  const seen = new Set();

  const cloneNode = (node) => {
    const { next, previous, children, ...rest } = node || {};
    return { ...rest, id: node.id, previous, next, children: [] };
  };

  const dfs = (id) => {
    if (!id || seen.has(id) || !nodesById[id]) return null;
    seen.add(id);

    const node = nodesById[id];
    const out = cloneNode(node);

    const nextArr = Array.isArray(node.next)
      ? node.next
      : node.next != null
      ? [node.next]
      : [];

    for (const nxt of nextArr) {
      const nextId = typeof nxt === "string" ? nxt : nxt?.id;
      if (!nextId || !nodesById[nextId]) continue;

      const target = nodesById[nextId];
      if (target.previous == null || target.previous === id) {
        const built = dfs(nextId);
        if (built) out.children.push(built);
      }
    }
    return out;
  };

  return dfs(rootId);
}
