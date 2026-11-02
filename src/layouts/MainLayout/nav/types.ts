import type { ReactNode } from "react";

/** A single nav entry. */
export interface NavItemData {
  title: string;
  path: string;
  icon?: ReactNode;
  info?: ReactNode;
  disabled?: boolean;
  caption?: string;
  children?: NavItemData[];
  [key: string]: unknown;
}

/** A grouped list of nav entries under an optional subheader. */
export interface NavListData {
  subheader?: string;
  title?: string;
  path?: string;
  icon?: ReactNode;
  items?: NavItemData[];
  children?: NavListData[];
  [key: string]: unknown;
}
