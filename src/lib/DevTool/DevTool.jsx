import { Box, Divider } from "@mui/material";

import React from "react";

const DevTool = ({
  width = 62,
  height = "auto",
  top = "50%",
  open = true,
  content,
  header,
  footer,
  sx,
}) => {
  if (!open) return null;

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        top,
        right: 0,
        transform: "translateY(-50%)",
        width,
        height,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "background.paper"
            : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.07)"
          }`,
        borderRadius: "4px",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
        zIndex: (theme) => theme.zIndex.modal + 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 1.5,
        overflowY: "hidden",
        overflowX: "hidden",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        ...(sx || {}),
      }}
    >
      {header && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {header}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {content}
      </Box>

      {footer && (
        <>
          <Divider
            flexItem
            sx={{
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
              width: "100%",
              flexShrink: 0,
            }}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              pt: 0.5,
            }}
          >
            {footer}
          </Box>
        </>
      )}
    </Box>
  );
};

export default DevTool;
