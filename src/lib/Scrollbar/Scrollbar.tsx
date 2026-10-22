import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { forwardRef } from "react";

import { StyledRootScrollbar, StyledScrollbar } from "./styles";
import type { SxProps, Theme } from "@mui/material/styles";

const Scrollbar = forwardRef<
  HTMLDivElement,
  { children?: ReactNode; sx?: SxProps<Theme> }
>(({ children, sx }, ref) => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  const mobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  if (mobile) {
    return (
      <Box
        ref={ref}
        sx={[{ overflow: "auto" }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar
        scrollableNodeProps={{ ref }}
        clickOnTrack={false}
        sx={sx}
      >
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
});

export default Scrollbar;
