import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { FlowNode, FlowNodeMap } from "../types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export interface Point {
  x: number;
  y: number;
}

/** Per-node imperative handlers registered by `<DraggableNode>`. */
export interface NodeHandlers {
  setOffset?: Dispatch<SetStateAction<Point>>;
  onDrag?: () => void;
}

/** A node captured onto the clipboard by a cut. */
export interface ClipboardNode extends FlowNode {
  _originalId?: string;
}

export interface PasteStructure {
  nodes: FlowNodeMap;
  roots: string[];
  _pastePosition: Point;
}

type PasteCallback = (data: PasteStructure, position: Point) => unknown;

export interface SelectionContextValue {
  selectedIds: Set<string>;
  selectNode: (id: string, addToSelection?: boolean) => void;
  deselectNode: (id: string) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectMultiple: (ids: Iterable<string>) => void;
  addToSelection: (ids: Iterable<string>) => void;
  isSelected: (id: string) => boolean;
  registerNodeHandlers: (id: string, handlers: NodeHandlers) => () => void;
  moveSelectedNodes: (
    deltaX: number,
    deltaY: number,
    excludeId?: string | null
  ) => void;
  cutSelectedNodes: (
    nodesById: FlowNodeMap | null | undefined,
    onCut?: (ids: string[]) => void
  ) => void;
  pasteNodes: (callback: PasteCallback, x?: number, y?: number) => unknown;
  hasClipboard: boolean;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

const DEFAULT_CONTEXT: SelectionContextValue = {
  selectedIds: new Set(),
  selectNode: () => {},
  deselectNode: () => {},
  toggleSelection: () => {},
  clearSelection: () => {},
  selectMultiple: () => {},
  addToSelection: () => {},
  isSelected: () => false,
  registerNodeHandlers: () => () => {},
  moveSelectedNodes: () => {},
  cutSelectedNodes: () => {},
  pasteNodes: () => {},
  hasClipboard: false,
};

const filterNextToSelection = (
  next: FlowNode["next"],
  selectedSet: Set<string>
): FlowNode["next"] => {
  if (!next) return undefined;

  if (Array.isArray(next)) {
    const filtered = next.filter(
      (id): id is string => typeof id === "string" && selectedSet.has(id)
    );
    return filtered.length > 0 ? filtered : undefined;
  }

  return typeof next === "string" && selectedSet.has(next) ? next : undefined;
};

const buildClipboardNode = (
  id: string,
  node: FlowNode,
  selectedSet: Set<string>
): ClipboardNode => {
  const filteredNext = filterNextToSelection(node.next, selectedSet);
  const hasPreviousInSelection =
    typeof node.previous === "string" && selectedSet.has(node.previous);

  return {
    ...node,
    id,
    _originalId: id,
    next: filteredNext,
    previous: hasPreviousInSelection ? node.previous : undefined,
  };
};

const buildPasteStructure = (
  clipboardNodes: ClipboardNode[],
  position: Point
): PasteStructure | null => {
  if (!clipboardNodes?.length) return null;

  const seenIds = new Set<string>();
  const nodes: FlowNodeMap = {};

  clipboardNodes.forEach((clipNode) => {
    const nodeId = clipNode._originalId || clipNode.id;
    if (!nodeId || seenIds.has(nodeId)) return;

    seenIds.add(nodeId);

    nodes[nodeId] = {
      id: nodeId,
      label: clipNode.label,
      next: clipNode.next,
      previous: clipNode.previous,
    };

    Object.keys(clipNode).forEach((key) => {
      if (!["_originalId", "id", "next", "previous", "label"].includes(key)) {
        nodes[nodeId][key] = clipNode[key];
      }
    });
  });

  const rootIds = Object.keys(nodes).filter((id) => !nodes[id].previous);
  const uniqueRoots = [...new Set(rootIds)];
  const finalRoots =
    uniqueRoots.length > 0 ? uniqueRoots : [Object.keys(nodes)[0]];

  return {
    nodes,
    roots: finalRoots,
    _pastePosition: position,
  };
};

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<ClipboardNode[]>([]);
  const nodeHandlersRef = useRef(new Map<string, NodeHandlers>());
  const isPastingRef = useRef(false);

  const selectNode = useCallback((id: string, addToSelection = false) => {
    setSelectedIds((prev) => {
      const next = new Set(addToSelection ? prev : []);
      next.add(id);
      return next;
    });
  }, []);

  const deselectNode = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const selectMultiple = useCallback(
    (ids: Iterable<string>) => setSelectedIds(new Set(ids)),
    []
  );

  const addToSelection = useCallback(
    (ids: Iterable<string>) =>
      setSelectedIds((prev) => new Set([...prev, ...ids])),
    []
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const registerNodeHandlers = useCallback(
    (id: string, handlers: NodeHandlers) => {
      nodeHandlersRef.current.set(id, handlers);
      return () => nodeHandlersRef.current.delete(id);
    },
    []
  );

  const moveSelectedNodes = useCallback(
    (deltaX: number, deltaY: number, excludeId: string | null = null) => {
      selectedIds.forEach((id) => {
        if (id === excludeId) return;

        const handlers = nodeHandlersRef.current.get(id);
        if (!handlers) return;

        handlers.setOffset?.((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
        handlers.onDrag?.();
      });
    },
    [selectedIds]
  );

  const cutSelectedNodes = useCallback(
    (
      nodesById: FlowNodeMap | null | undefined,
      onCut?: (ids: string[]) => void
    ) => {
      if (!nodesById || selectedIds.size === 0) return;

      const selectedSet = new Set(selectedIds);
      const seenIds = new Set<string>();
      const cutNodes: ClipboardNode[] = [];

      [...selectedIds].forEach((id) => {
        if (!nodesById[id] || seenIds.has(id)) return;
        seenIds.add(id);
        cutNodes.push(buildClipboardNode(id, nodesById[id], selectedSet));
      });

      setClipboard(cutNodes);
      onCut?.([...selectedIds]);
      setSelectedIds(new Set());
    },
    [selectedIds]
  );

  const pasteNodes = useCallback(
    (callback: PasteCallback, x = 0, y = 0) => {
      if (!clipboard.length || !callback || isPastingRef.current) return;

      isPastingRef.current = true;
      const nodesToPaste = [...clipboard];

      const pasteData = buildPasteStructure(nodesToPaste, { x, y });
      if (!pasteData) {
        isPastingRef.current = false;
        return;
      }

      let result: unknown;
      try {
        result = callback(pasteData, { x, y });
      } catch (error) {
        isPastingRef.current = false;
        throw error;
      }

      if (result && typeof (result as { then?: unknown }).then === "function") {
        return (result as Promise<unknown>)
          .then(() => {
            setClipboard([]);
          })
          .finally(() => {
            isPastingRef.current = false;
          });
      }

      setClipboard([]);
      isPastingRef.current = false;
      return result;
    },
    [clipboard]
  );

  const hasClipboard = clipboard.length > 0;

  const contextValue = useMemo<SelectionContextValue>(
    () => ({
      selectedIds,
      selectNode,
      deselectNode,
      toggleSelection,
      clearSelection,
      selectMultiple,
      addToSelection,
      isSelected,
      registerNodeHandlers,
      moveSelectedNodes,
      cutSelectedNodes,
      pasteNodes,
      hasClipboard,
    }),
    [
      selectedIds,
      selectNode,
      deselectNode,
      toggleSelection,
      clearSelection,
      selectMultiple,
      addToSelection,
      isSelected,
      registerNodeHandlers,
      moveSelectedNodes,
      cutSelectedNodes,
      pasteNodes,
      hasClipboard,
    ]
  );

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextValue =>
  useContext(SelectionContext) || DEFAULT_CONTEXT;

export default SelectionContext;
