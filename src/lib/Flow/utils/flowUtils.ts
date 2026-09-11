import type {
  FlowNext,
  FlowNextRef,
  FlowNode,
  FlowNodeMap,
  FlowStructure,
  LinkedGraph,
  NodeContentParts,
  TreeNode,
} from "../types";

const nextRefId = (ref: FlowNextRef): string =>
  typeof ref === "string" ? ref : ref?.id;

export interface AssertedLinkedGraph {
  nodesById: FlowNodeMap;
  roots: string[];
}

export function assertLinkedGraph(data: unknown): AssertedLinkedGraph {
  if (!data || typeof data !== "object") {
    throw new Error(
      "FlowChart expected a linked graph object: { nodes, roots? }."
    );
  }
  const { nodes, roots } = data as Partial<LinkedGraph>;
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

export function buildTreeFromLinked(
  rootId: string,
  nodesById: FlowNodeMap
): TreeNode | null {
  if (!rootId || !nodesById?.[rootId]) return null;
  const seen = new Set<string>();

  const cloneNode = (node: FlowNode): TreeNode => {
    const { next, previous, ...rest } = node;
    return { ...rest, id: node.id, previous, next, children: [] };
  };

  const dfs = (id: string): TreeNode | null => {
    if (!id || seen.has(id) || !nodesById[id]) return null;
    seen.add(id);

    const node = nodesById[id];
    const out = cloneNode(node);

    const nextArr = Array.isArray(node.next)
      ? node.next
      : node.next !== null && node.next !== undefined
      ? [node.next]
      : [];

    for (const nxt of nextArr) {
      const nextId = nextRefId(nxt);
      if (!nextId || !nodesById[nextId]) continue;

      const target = nodesById[nextId];
      if (
        target.previous === null ||
        target.previous === undefined ||
        target.previous === id
      ) {
        const built = dfs(nextId);
        if (built) out.children.push(built);
      }
    }
    return out;
  };

  return dfs(rootId);
}

export const getContentParts = (n: FlowNode): NodeContentParts => {
  const entries = Object.entries(n).filter(
    ([key]) =>
      key !== "children" && key !== "id" && key !== "previous" && key !== "next"
  );

  if (entries.length === 0) {
    return {
      title: "(empty)",
      subtitle: null,
      metaEntries: [],
    };
  }

  const preferredTitleKeys = ["label", "title", "name"];
  const titleEntry =
    entries.find(([key]) => preferredTitleKeys.includes(key)) || entries[0];
  const [titleKey, rawTitle] = titleEntry;
  const title = String(rawTitle);
  let remaining = entries.filter(([key]) => key !== titleKey);

  const preferredSubtitleKeys = ["description", "role", "type", "status"];
  const subtitleEntry =
    remaining.find(([key]) => preferredSubtitleKeys.includes(key)) || null;

  let subtitle: string | null = null;
  if (subtitleEntry) {
    const [subtitleKey, raw] = subtitleEntry;
    subtitle = String(raw);
    remaining = remaining.filter(([key]) => key !== subtitleKey);
  }

  const metaEntries = remaining
    .filter(([, value]) => {
      const t = typeof value;
      return (
        (t === "string" || t === "number" || t === "boolean") &&
        value !== "" &&
        value !== null
      );
    })
    .map(([k, v]): [string, unknown] => [k, v]);

  return { title, subtitle, metaEntries };
};

export const toNextArray = (next: FlowNext): string[] => {
  if (!next) return [];
  return (Array.isArray(next) ? next : [next]).map(nextRefId);
};

export const setNextProperty = (node: FlowNode, nextIds: string[]): void => {
  if (!nextIds || nextIds.length === 0) {
    delete node.next;
  } else if (nextIds.length === 1) {
    node.next = nextIds[0];
  } else {
    node.next = nextIds;
  }
};

export const addToNext = (node: FlowNode, childIds: string[]): void => {
  const current = toNextArray(node.next);
  const newIds = childIds.filter((id) => !current.includes(id));
  setNextProperty(node, [...current, ...newIds]);
};

export const removeFromNext = (node: FlowNode, childIds: string[]): void => {
  const removeSet = new Set(childIds);
  const filtered = toNextArray(node.next).filter((id) => !removeSet.has(id));
  setNextProperty(node, filtered);
};

export const cleanupReferences = (
  nodes: FlowNodeMap,
  removedIds: Iterable<string>
): void => {
  const removeSet = new Set(removedIds);
  Object.values(nodes).forEach((node) => {
    if (typeof node.next === "string" && removeSet.has(node.next)) {
      delete node.next;
    } else if (Array.isArray(node.next)) {
      const filtered = node.next
        .map(nextRefId)
        .filter((n) => !removeSet.has(n));
      setNextProperty(node, filtered);
    }
    if (typeof node.previous === "string" && removeSet.has(node.previous)) {
      delete node.previous;
    }
  });
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const buildDetachedTree = (
  rootId: string,
  nodesById: FlowNodeMap
): TreeNode | null => {
  if (!rootId || !nodesById?.[rootId]) return null;
  const seen = new Set<string>();

  const buildNode = (id: string): TreeNode | null => {
    if (!id || seen.has(id) || !nodesById[id]) return null;
    seen.add(id);

    const node = nodesById[id];
    const { next, ...rest } = node;
    const result: TreeNode = { ...rest, id, children: [] };

    const nextIds = Array.isArray(next)
      ? next
      : next !== null && next !== undefined
      ? [next]
      : [];

    nextIds.forEach((nxt) => {
      const nextId = nextRefId(nxt);
      if (!nextId || !nodesById[nextId]) return;

      const child = buildNode(nextId);
      if (child) result.children.push(child);
    });

    return result;
  };

  return buildNode(rootId);
};

export const getSelectedInStructure = (
  structure: FlowStructure,
  selectedIds: string[]
): string[] => selectedIds.filter((id) => structure.nodes?.[id]);

export const getRootsToConnect = (
  structure: FlowStructure,
  selectedIds: string[]
): string[] => {
  const selectedSet = new Set(selectedIds);
  const roots: string[] = [];

  selectedIds.forEach((id) => {
    let current = structure.nodes[id];
    if (!current) return;

    let rootId = id;

    while (
      typeof current.previous === "string" &&
      structure.nodes[current.previous]
    ) {
      if (selectedSet.has(current.previous)) {
        rootId = current.previous;
        current = structure.nodes[current.previous];
      } else break;
    }

    if (!current.previous && !roots.includes(rootId)) {
      roots.push(rootId);
    }
  });

  if (roots.length > 0) return roots;

  return selectedIds.filter((id) => {
    const node = structure.nodes[id];
    return (
      node &&
      (!node.previous ||
        typeof node.previous !== "string" ||
        !structure.nodes[node.previous])
    );
  });
};

export const collectSubtree = (
  structure: FlowStructure,
  roots: string[],
  selectedIds: string[]
): Set<string> => {
  const selectedSet = new Set(selectedIds);
  const collected = new Set<string>();

  const dfs = (id: string): void => {
    if (collected.has(id) || !structure.nodes[id]) return;
    collected.add(id);

    toNextArray(structure.nodes[id].next).forEach((childId) => {
      if (structure.nodes[childId] && selectedSet.has(childId)) {
        dfs(childId);
      }
    });
  };

  roots.forEach(dfs);
  return collected;
};

export const splitFloatingStructure = (
  structure: FlowStructure,
  removedIds: Set<string>
): FlowStructure => {
  const remainingNodes: FlowNodeMap = {};

  Object.entries(structure.nodes).forEach(([id, node]) => {
    if (!removedIds.has(id)) {
      remainingNodes[id] = node;
    }
  });

  cleanupReferences(remainingNodes, [...removedIds]);

  const remainingRoots =
    structure.roots?.filter((r) => !removedIds.has(r)) ?? [];

  const roots =
    remainingRoots.length > 0
      ? remainingRoots
      : Object.keys(remainingNodes).filter(
          (id) => !remainingNodes[id].previous
        );

  return {
    ...structure,
    nodes: remainingNodes,
    roots: [...new Set(roots)],
  };
};
