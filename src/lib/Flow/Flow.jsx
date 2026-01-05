import FlowNode from "./FlowNode";
import { v4 as uuidv4 } from "uuid";

import React, { useCallback, useMemo, useState } from "react";
import {
  addToNext,
  assertLinkedGraph,
  buildTreeFromLinked,
  cleanupReferences,
  removeFromNext,
  toNextArray,
} from "./flowUtils";

export const Flow = ({
  data,
  variant = "simple",
  style,
  plugin,
  editable = false,
  onChange,
}) => {
  const [floatingNodes, setFloatingNodes] = useState([]);

  const { nodesById, roots } = useMemo(() => assertLinkedGraph(data), [data]);

  const allNodesById = useMemo(() => {
    const floatingNodeIds = new Set();
    floatingNodes.forEach((structure) => {
      if (structure?.nodes) {
        Object.keys(structure.nodes).forEach((id) => floatingNodeIds.add(id));
      }
    });

    const mainTreeNodes = {};
    Object.keys(nodesById).forEach((id) => {
      if (!floatingNodeIds.has(id)) {
        mainTreeNodes[id] = nodesById[id];
      }
    });

    const merged = { ...mainTreeNodes };
    floatingNodes.forEach((structure) => {
      if (structure?.nodes) {
        Object.assign(merged, structure.nodes);
      }
    });

    return merged;
  }, [nodesById, floatingNodes]);

  const findFloatingStructure = useCallback(
    (nodeId) => {
      const index = floatingNodes.findIndex(
        (s) => s?.nodes && nodeId in s.nodes
      );
      return index >= 0 ? { structure: floatingNodes[index], index } : null;
    },
    [floatingNodes]
  );

  const handleCut = useCallback(
    (nodeIds) => {
      if (!editable || !onChange || !data?.nodes) return;

      const cutSet = new Set(nodeIds);

      const isInMainTree = nodeIds.some((id) => data.nodes[id]);
      const isInFloating = nodeIds.some((id) =>
        floatingNodes.some((s) => s.nodes?.[id])
      );

      if (isInMainTree) {
        const updatedNodes = { ...data.nodes };
        let updatedRoots = [...(data.roots || [])];

        nodeIds.forEach((cutId) => {
          const cutNode = updatedNodes[cutId];
          if (!cutNode) return;

          const parentId = cutNode.previous;
          const childIds = toNextArray(cutNode.next);
          const orphanIds = childIds.filter((id) => !cutSet.has(id));

          orphanIds.forEach((orphanId) => {
            const orphan = updatedNodes[orphanId];
            if (!orphan) return;

            const hasValidParent =
              parentId && updatedNodes[parentId] && !cutSet.has(parentId);

            if (hasValidParent) {
              orphan.previous = parentId;
              addToNext(updatedNodes[parentId], [orphanId]);
            } else {
              delete orphan.previous;
              if (!updatedRoots.includes(orphanId)) {
                updatedRoots.push(orphanId);
              }
            }
          });
        });

        nodeIds.forEach((id) => delete updatedNodes[id]);
        updatedRoots = updatedRoots.filter((r) => !cutSet.has(r));

        cleanupReferences(updatedNodes, nodeIds);

        onChange({ nodes: updatedNodes, roots: [...new Set(updatedRoots)] });
      }

      if (isInFloating) {
        setFloatingNodes((prev) =>
          prev
            .map((structure) => {
              const hasAffectedNodes = nodeIds.some(
                (id) => structure.nodes?.[id]
              );
              if (!hasAffectedNodes) return structure;

              const newNodes = { ...structure.nodes };
              const newRoots = [...(structure.roots || [])];

              nodeIds.forEach((id) => {
                if (newNodes[id]) {
                  const node = newNodes[id];
                  const childIds = toNextArray(node.next);
                  const orphanIds = childIds.filter((cid) => !cutSet.has(cid));

                  orphanIds.forEach((orphanId) => {
                    if (newNodes[orphanId]) {
                      const parent = node.previous;
                      if (parent && newNodes[parent] && !cutSet.has(parent)) {
                        newNodes[orphanId].previous = parent;
                        addToNext(newNodes[parent], [orphanId]);
                      } else {
                        delete newNodes[orphanId].previous;
                        if (!newRoots.includes(orphanId)) {
                          newRoots.push(orphanId);
                        }
                      }
                    }
                  });

                  delete newNodes[id];
                }
              });

              const filteredRoots = newRoots.filter(
                (r) => !cutSet.has(r) && newNodes[r]
              );

              cleanupReferences(newNodes, nodeIds);

              if (Object.keys(newNodes).length === 0) return null;

              return {
                ...structure,
                nodes: newNodes,
                roots: [...new Set(filteredRoots)],
              };
            })
            .filter(Boolean)
        );
      }
    },
    [editable, onChange, data, floatingNodes]
  );

  const handlePaste = useCallback(
    (structure) => {
      if (!editable || !structure?.nodes || !structure?.roots?.length) return;

      const mainNodeIds = new Set(Object.keys(data?.nodes || {}));

      // 1. Identify valid nodes (not already in main tree)
      const validNodes = {};
      const validNodeIds = Object.keys(structure.nodes).filter(
        (id) => !mainNodeIds.has(id)
      );

      if (validNodeIds.length === 0) return;

      validNodeIds.forEach((id) => {
        validNodes[id] = structure.nodes[id];
      });

      const internalChildIds = new Set();

      validNodeIds.forEach((id) => {
        const node = validNodes[id];

        const nextIds = toNextArray(node.next || node.raw?.next);
        nextIds.forEach((childId) => internalChildIds.add(childId));
      });

      const validRoots = structure.roots.filter(
        (id) => validNodes[id] && !internalChildIds.has(id)
      );

      if (validRoots.length === 0) return;

      const newPasteItem = {
        ...structure,
        nodes: validNodes,
        roots: [...new Set(validRoots)],
        _pasteId: uuidv4(),
      };

      setFloatingNodes((prev) => {
        const existingFloatingIds = new Set(
          prev.flatMap((item) => Object.keys(item.nodes))
        );

        const hasOverlap = validNodeIds.some((id) =>
          existingFloatingIds.has(id)
        );

        if (hasOverlap) {
          console.log("Paste blocked: Nodes already exist in floating layer.");
          return prev;
        }

        return [...prev, newPasteItem];
      });
    },
    [editable, data]
  );

  const handleConnect = useCallback(
    (targetNodeId, selectedIds) => {
      if (!editable || !onChange || !selectedIds?.length) return;

      const targetInTree = data?.nodes?.[targetNodeId];
      const targetFloating = findFloatingStructure(targetNodeId);
      const sourceInTree = selectedIds.some((id) => data?.nodes?.[id]);
      const sourceFloating = selectedIds
        .map((id) => findFloatingStructure(id))
        .find(Boolean);

      if (sourceFloating && targetInTree) {
        const { structure, index } = sourceFloating;
        const selectedSet = new Set(selectedIds);
        const selectedInStructure = selectedIds.filter(
          (id) => structure.nodes?.[id]
        );

        if (selectedInStructure.length === 0) return;

        const updatedNodes = { ...data.nodes };

        const rootsToConnect = [];

        selectedInStructure.forEach((selectedId) => {
          const node = structure.nodes[selectedId];
          if (!node) return;

          let rootId = selectedId;
          let current = node;

          while (current.previous && structure.nodes[current.previous]) {
            if (selectedSet.has(current.previous)) {
              rootId = current.previous;
              current = structure.nodes[current.previous];
            } else {
              break;
            }
          }

          if (!current.previous) {
            if (!rootsToConnect.includes(rootId)) {
              rootsToConnect.push(rootId);
            }
          }
        });

        if (rootsToConnect.length === 0) {
          rootsToConnect.push(
            ...selectedInStructure.filter((id) => {
              const node = structure.nodes[id];
              return !node.previous || !structure.nodes[node.previous];
            })
          );
        }

        const collectSubtree = (nodeId, collected) => {
          if (collected.has(nodeId) || !structure.nodes[nodeId]) return;
          collected.add(nodeId);

          const node = structure.nodes[nodeId];
          const nextIds = toNextArray(node.next);
          nextIds.forEach((childId) => {
            if (structure.nodes[childId] && selectedSet.has(childId)) {
              collectSubtree(childId, collected);
            }
          });
        };

        const connectedNodeIds = new Set();
        rootsToConnect.forEach((rootId) => {
          collectSubtree(rootId, connectedNodeIds);
        });

        connectedNodeIds.forEach((nodeId) => {
          if (structure.nodes[nodeId]) {
            updatedNodes[nodeId] = { ...structure.nodes[nodeId] };
          }
        });

        rootsToConnect.forEach((rootId) => {
          if (updatedNodes[rootId]) {
            updatedNodes[rootId].previous = targetNodeId;
          }
        });

        if (updatedNodes[targetNodeId]) {
          addToNext(updatedNodes[targetNodeId], rootsToConnect);
        }

        const remainingRoots = (structure.roots || []).filter(
          (rootId) => !connectedNodeIds.has(rootId)
        );

        onChange({ nodes: updatedNodes, roots: data.roots });

        setFloatingNodes((prev) => {
          if (connectedNodeIds.size === Object.keys(structure.nodes).length) {
            return prev.filter((_, i) => i !== index);
          }

          const remainingNodes = {};
          Object.entries(structure.nodes).forEach(([id, node]) => {
            if (!connectedNodeIds.has(id)) {
              remainingNodes[id] = node;
            }
          });

          cleanupReferences(remainingNodes, [...connectedNodeIds]);

          const newRoots =
            remainingRoots.length > 0
              ? remainingRoots
              : Object.keys(remainingNodes).filter(
                  (id) => !remainingNodes[id].previous
                );

          const updated = [...prev];
          updated[index] = {
            ...structure,
            nodes: remainingNodes,
            roots: [...new Set(newRoots)],
          };

          return updated.filter((s) => Object.keys(s.nodes).length > 0);
        });
        return;
      }

      if (sourceInTree && targetFloating) {
        const { structure, index } = targetFloating;
        const updatedNodes = { ...data.nodes };
        let updatedRoots = [...(data.roots || [])];

        selectedIds.forEach((sourceId) => {
          const sourceNode = updatedNodes[sourceId];
          if (!sourceNode) return;

          if (sourceNode.previous && updatedNodes[sourceNode.previous]) {
            removeFromNext(updatedNodes[sourceNode.previous], [sourceId]);
          }

          updatedRoots = updatedRoots.filter((r) => r !== sourceId);
          delete updatedNodes[sourceId];
        });

        onChange({ nodes: updatedNodes, roots: [...new Set(updatedRoots)] });

        setFloatingNodes((prev) => {
          const updated = [...prev];
          const newStructure = {
            ...structure,
            nodes: { ...structure.nodes },
          };

          selectedIds.forEach((sourceId) => {
            if (data?.nodes?.[sourceId]) {
              newStructure.nodes[sourceId] = {
                ...data.nodes[sourceId],
                previous: targetNodeId,
                next: undefined,
              };
            }
          });

          addToNext(newStructure.nodes[targetNodeId], selectedIds);
          updated[index] = newStructure;
          return updated;
        });
        return;
      }

      if (sourceFloating && targetFloating) {
        const { structure: sourceStruct, index: sourceIndex } = sourceFloating;
        const { index: targetIndex } = targetFloating;

        if (sourceIndex === targetIndex) return;

        const selectedSet = new Set(selectedIds);
        const selectedInStructure = selectedIds.filter(
          (id) => sourceStruct.nodes?.[id]
        );

        if (selectedInStructure.length === 0) return;

        const rootsToConnect = [];
        selectedInStructure.forEach((selectedId) => {
          const node = sourceStruct.nodes[selectedId];
          if (!node) return;

          let rootId = selectedId;
          let current = node;

          while (current.previous && sourceStruct.nodes[current.previous]) {
            if (selectedSet.has(current.previous)) {
              rootId = current.previous;
              current = sourceStruct.nodes[current.previous];
            } else {
              break;
            }
          }

          if (!current.previous) {
            if (!rootsToConnect.includes(rootId)) {
              rootsToConnect.push(rootId);
            }
          }
        });

        if (rootsToConnect.length === 0) {
          rootsToConnect.push(
            ...selectedInStructure.filter((id) => {
              const node = sourceStruct.nodes[id];
              return !node.previous || !sourceStruct.nodes[node.previous];
            })
          );
        }

        const collectSubtree = (nodeId, collected) => {
          if (collected.has(nodeId) || !sourceStruct.nodes[nodeId]) return;
          collected.add(nodeId);

          const node = sourceStruct.nodes[nodeId];
          const nextIds = toNextArray(node.next);
          nextIds.forEach((childId) => {
            if (sourceStruct.nodes[childId] && selectedSet.has(childId)) {
              collectSubtree(childId, collected);
            }
          });
        };

        const connectedNodeIds = new Set();
        rootsToConnect.forEach((rootId) => {
          collectSubtree(rootId, connectedNodeIds);
        });

        setFloatingNodes((prev) => {
          const updated = prev.filter((_, i) => i !== sourceIndex);
          const adjustedIndex =
            targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;

          const targetStructure = updated[adjustedIndex];
          const merged = {
            ...targetStructure,
            nodes: {
              ...targetStructure.nodes,
            },
          };

          connectedNodeIds.forEach((nodeId) => {
            if (sourceStruct.nodes[nodeId]) {
              merged.nodes[nodeId] = { ...sourceStruct.nodes[nodeId] };
            }
          });

          rootsToConnect.forEach((rootId) => {
            if (merged.nodes[rootId]) {
              merged.nodes[rootId].previous = targetNodeId;
            }
          });

          if (merged.nodes[targetNodeId]) {
            addToNext(merged.nodes[targetNodeId], rootsToConnect);
          }

          updated[adjustedIndex] = merged;

          if (connectedNodeIds.size < Object.keys(sourceStruct.nodes).length) {
            const remainingNodes = {};
            Object.entries(sourceStruct.nodes).forEach(([id, node]) => {
              if (!connectedNodeIds.has(id)) {
                remainingNodes[id] = node;
              }
            });

            cleanupReferences(remainingNodes, [...connectedNodeIds]);

            const remainingRoots = (sourceStruct.roots || []).filter(
              (rootId) => !connectedNodeIds.has(rootId)
            );

            const newRoots =
              remainingRoots.length > 0
                ? remainingRoots
                : Object.keys(remainingNodes).filter(
                    (id) => !remainingNodes[id].previous
                  );

            if (Object.keys(remainingNodes).length > 0) {
              updated.push({
                ...sourceStruct,
                nodes: remainingNodes,
                roots: [...new Set(newRoots)],
              });
            }
          }

          return updated.filter((s) => Object.keys(s.nodes).length > 0);
        });
      }
    },
    [editable, onChange, data, findFloatingStructure]
  );

  const treeData = useMemo(() => {
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
      ? { id: "__root__", label: "Start", children }
      : null;
  }, [nodesById, roots]);

  return (
    <FlowNode
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
    />
  );
};

export default Flow;
