import NavList from "./nav-list";
import Stack from "@mui/material/Stack";
import { memo } from "react";

import type { NavGroupData, NavItemData, NavSlotProps } from "../types";
import type { SxProps, Theme } from "@mui/material/styles";

interface NavSectionHorizontalProps {
  data: NavGroupData[];
  slotProps?: NavSlotProps;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

function NavSectionHorizontal({
  data,
  slotProps,
  sx,
  ...other
}: NavSectionHorizontalProps) {
  return (
    <Stack
      component="nav"
      id="nav-section-horizontal"
      direction="row"
      spacing={`${slotProps?.gap || 6}px`}
      {...other}
      sx={[
        {
          alignItems: "center",
          mx: "auto",
          ...sx,
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
    >
      {data.map((group, index: number) => (
        <Group
          key={group?.subheader || index}
          items={group?.items}
          slotProps={slotProps}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionHorizontal);

function Group({
  items,
  slotProps,
}: {
  items?: NavItemData[];
  slotProps?: NavSlotProps;
}) {
  return (
    <>
      {items?.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </>
  );
}
