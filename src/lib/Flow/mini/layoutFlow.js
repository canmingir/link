// Proportional to real node: 300×180 → 110×66
export const NODE_W = 110;
export const NODE_H = 66;
export const H_GAP = 72;
export const V_GAP = 32;
export const PAD = 16;

export function layoutFlow(nodes) {
  if (!nodes.length) return { positions: {}, edgeList: [], svgW: 0, svgH: 0 };

  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = n;
  });

  const referenced = new Set();
  nodes.forEach((n) => {
    (n.next || []).forEach((id) => referenced.add(id));
    (n.true || []).forEach((id) => referenced.add(id));
    (n.false || []).forEach((id) => referenced.add(id));
  });

  let roots = nodes.filter((n) => !referenced.has(n.id)).map((n) => n.id);
  if (!roots.length) roots = [nodes[0].id];

  const layerOf = {};
  const posInLayer = {};
  const layerCount = [];
  const queue = roots.map((id) => ({ id, layer: 0 }));
  const visited = new Set();

  while (queue.length) {
    const { id, layer } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    layerOf[id] = layer;
    if (layerCount[layer] === undefined) layerCount[layer] = 0;
    posInLayer[id] = layerCount[layer]++;

    const n = nodeMap[id];
    if (!n) continue;
    [...(n.next || []), ...(n.true || []), ...(n.false || [])].forEach(
      (cid) => {
        if (!visited.has(cid)) queue.push({ id: cid, layer: layer + 1 });
      }
    );
  }

  const maxLayer = Math.max(0, ...Object.values(layerOf));
  const maxInLayer = Math.max(1, ...layerCount);
  const positions = {};

  Object.keys(layerOf).forEach((id) => {
    const l = layerOf[id];
    const p = posInLayer[id];
    const count = layerCount[l];
    const totalH = count * NODE_H + (count - 1) * V_GAP;
    const centerOffset = (maxInLayer * (NODE_H + V_GAP) - totalH) / 2;
    positions[id] = {
      x: l * (NODE_W + H_GAP) + PAD,
      y: p * (NODE_H + V_GAP) + PAD + centerOffset,
    };
  });

  const edgeList = [];
  nodes.forEach((n) => {
    (n.next || []).forEach((to) =>
      edgeList.push({ from: n.id, to, kind: "default" })
    );
    (n.true || []).forEach((to) =>
      edgeList.push({ from: n.id, to, kind: "true" })
    );
    (n.false || []).forEach((to) =>
      edgeList.push({ from: n.id, to, kind: "false" })
    );
  });

  const svgW = (maxLayer + 1) * (NODE_W + H_GAP) - H_GAP + PAD * 2;
  const svgH = maxInLayer * (NODE_H + V_GAP) - V_GAP + PAD * 2;

  return { positions, edgeList, svgW, svgH };
}
