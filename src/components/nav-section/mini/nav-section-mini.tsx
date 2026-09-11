import NavList from "./nav-list";
import Stack from "@mui/material/Stack";
import { memo } from "react";

import type { NavGroupData, NavItemData, NavSlotProps } from "../types";

interface NavSectionMiniProps {
  data: NavGroupData[];
  slotProps?: NavSlotProps;
  [key: string]: unknown;
}

function NavSectionMini({ data, slotProps, ...other }: NavSectionMiniProps) {
  return (
    <Stack
      component="nav"
      id="nav-section-mini"
      spacing={`${slotProps?.gap || 4}px`}
      {...other}
    >
      {data.map((group, index: number) => (
        <Group
          key={group.subheader || index}
          items={group.items}
          slotProps={slotProps}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionMini);

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
