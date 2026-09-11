import { Box } from "@mui/material";
import { hexToRgba } from "../utils/flowUtils";

import type { SxProps, Theme } from "@mui/material/styles";

const HANDLE_SIZE = 10;
const HANDLE_THICKNESS = 2;

type Corner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

const cornerStyles = (placement: Corner): SxProps<Theme> => {
  const base = {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderColor: "inherit",
    borderStyle: "solid",
    borderWidth: 0,
  };

  const map: Record<Corner, Record<string, number>> = {
    topLeft: {
      top: 0,
      left: 0,
      borderTopWidth: HANDLE_THICKNESS,
      borderLeftWidth: HANDLE_THICKNESS,
    },
    topRight: {
      top: 0,
      right: 0,
      borderTopWidth: HANDLE_THICKNESS,
      borderRightWidth: HANDLE_THICKNESS,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: HANDLE_THICKNESS,
      borderLeftWidth: HANDLE_THICKNESS,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: HANDLE_THICKNESS,
      borderRightWidth: HANDLE_THICKNESS,
    },
  };

  return { ...base, ...map[placement] } as SxProps<Theme>;
};

interface SelectionBoxRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface SelectionOverlayProps {
  box?: SelectionBoxRect | null;
  selectionColor?: string;
}

const SelectionOverlay = ({
  box,
  selectionColor = "#64748b",
}: SelectionOverlayProps) => {
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
        backgroundColor: hexToRgba(selectionColor, 0.08),
        pointerEvents: "none",
        zIndex: 9999,
        borderRadius: "4px",
        color: selectionColor,
      }}
    >
      {(["topLeft", "topRight", "bottomLeft", "bottomRight"] as Corner[]).map(
        (placement) => (
          <Box key={placement} sx={cornerStyles(placement)} />
        )
      )}
    </Box>
  );
};

export default SelectionOverlay;
