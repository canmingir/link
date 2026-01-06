import { Box } from "@mui/material";
import { hexToRgba } from "../utils/flowUtils";

const SelectionOverlay = ({ box, selectionColor = "#64748b" }) => {
  if (!box) return null;

  const { startX, startY, currentX, currentY } = box;
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  return (
    <Box
      sx={{
        position: "fixed",
        left,
        top,
        width,
        height,
        border: `2px solid ${selectionColor}`,
        backgroundColor: hexToRgba(selectionColor, 0.1),
        pointerEvents: "none",
        zIndex: 9999,
        borderRadius: "4px",
      }}
    />
  );
};

export default SelectionOverlay;
