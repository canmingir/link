import type { ReactNode } from "react";

/** A single nav entry rendered by NavList. */
export interface NavItemData {
  title: string;
  compactTitle?: ReactNode;
  path: string;
  icon?: ReactNode;
  info?: ReactNode;
  caption?: ReactNode;
  disabled?: boolean;
  external?: boolean;
  roles?: string[];
  children?: NavItemData[];
  [key: string]: unknown;
}

/** A group of nav entries under an optional subheader. */
export interface NavGroupData {
  subheader?: string;
  items?: NavItemData[];
}

/** Per-slot style/prop overrides threaded through the nav tree. */
export interface NavSlotProps {
  rootItem?: Record<string, unknown>;
  subItem?: Record<string, unknown>;
  subheader?: Record<string, unknown>;
  gap?: number;
  currentRole?: string;
  [key: string]: unknown;
}
