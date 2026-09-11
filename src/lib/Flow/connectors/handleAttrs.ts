export const HANDLE_TYPE_ATTR = "data-handle-type";
export const NODE_ID_ATTR = "data-node-id";
export const FIELD_ATTR = "data-field";

export type HandleSide = "in" | "out";

export const handleDataAttrs = (
  side: HandleSide,
  nodeId: string,
  field: string
): Record<string, string> => ({
  [HANDLE_TYPE_ATTR]: side,
  [NODE_ID_ATTR]: nodeId,
  [FIELD_ATTR]: field,
});

export const handleKey = (
  type: string,
  nodeId: string,
  field: string
): string => `${type}:${nodeId}:${field}`;

export function collectHandles(
  container: HTMLElement
): Map<string, HTMLElement> {
  const map = new Map<string, HTMLElement>();
  container
    .querySelectorAll<HTMLElement>(`[${HANDLE_TYPE_ATTR}]`)
    .forEach((el) => {
      const { handleType, nodeId, field } = el.dataset;
      if (!handleType || !nodeId || !field) return;
      map.set(handleKey(handleType, nodeId, field), el);
    });
  return map;
}
