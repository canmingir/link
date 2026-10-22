import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material";
export const inputSx = {
  "& .MuiFilledInput-root": {
    borderRadius: 1.5,
    fontSize: "0.9375rem",
    bgcolor: (theme: Theme) => alpha(theme.palette.grey[500], 0.08),
    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.grey[500], 0.12),
    },
    "&.Mui-focused": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
    },
    "&:before, &:after": { display: "none" },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },
};

export const primaryButtonSx = {
  py: 1.5,
  fontSize: "0.9375rem",
  fontWeight: 700,
  textTransform: "none",
  borderRadius: 1.5,
  letterSpacing: "0.01em",
  background: (theme: Theme) =>
    `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  transition: "opacity 0.2s",
  "&:hover": {
    opacity: 0.88,
    background: (theme: Theme) =>
      `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  },
};
