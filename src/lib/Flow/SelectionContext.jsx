import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const SelectionContext = createContext(null);

export const SelectionProvider = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const nodeHandlersRef = useRef(new Map());

  const selectNode = useCallback((id, addToSelection = false) => {
    setSelectedIds((prev) => {
      const next = new Set(addToSelection ? prev : []);
      next.add(id);
      return next;
    });
  }, []);

  const deselectNode = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectMultiple = useCallback((ids) => {
    setSelectedIds(new Set(ids));
  }, []);

  const addToSelection = useCallback((ids) => {
    setSelectedIds((prev) => new Set([...prev, ...ids]));
  }, []);

  const isSelected = useCallback((id) => selectedIds.has(id), [selectedIds]);

  const registerNodeHandlers = useCallback((id, handlers) => {
    nodeHandlersRef.current.set(id, handlers);
    return () => nodeHandlersRef.current.delete(id);
  }, []);

  const moveSelectedNodes = useCallback(
    (deltaX, deltaY, excludeId = null) => {
      selectedIds.forEach((id) => {
        if (id !== excludeId) {
          const handlers = nodeHandlersRef.current.get(id);
          if (handlers) {
            if (handlers.setOffset) {
              handlers.setOffset((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
              }));
            }
            if (handlers.onDrag) {
              handlers.onDrag();
            }
          }
        }
      });
    },
    [selectedIds]
  );

  return (
    <SelectionContext.Provider
      value={{
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
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    return {
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
    };
  }
  return context;
};

export default SelectionContext;
