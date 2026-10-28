export const HANDLE_TYPE_ATTR = "data-handle-type";
export const NODE_ID_ATTR = "data-node-id";
export const FIELD_ATTR = "data-field";

export const handleDataAttrs = (side, nodeId, field) => ({
  [HANDLE_TYPE_ATTR]: side,
  [NODE_ID_ATTR]: nodeId,
  [FIELD_ATTR]: field,
});

export const handleKey = (type, nodeId, field) => `${type}:${nodeId}:${field}`;

export function collectHandles(container) {
  const map = new Map();
  container.querySelectorAll(`[${HANDLE_TYPE_ATTR}]`).forEach((el) => {
    const { handleType, nodeId, field } = el.dataset;
    if (!handleType || !nodeId || !field) return;
    map.set(handleKey(handleType, nodeId, field), el);
  });
  return map;
}
