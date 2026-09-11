import type { SxProps, Theme } from "@mui/material/styles";
import * as React from "react";

export interface DevToolFrameProps {
  width?: number | string;
  height?: number | string;
  top?: number | string;
  open?: boolean;
  content?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sx?: SxProps<Theme>;
}

declare const DevToolFrame: React.FC<DevToolFrameProps>;

export default DevToolFrame;
