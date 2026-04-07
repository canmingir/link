import NavList from "./nav-list";
import React from "react";
import Stack from "@mui/material/Stack";
import { memo } from "react";

function NavSectionHorizontal({ data, slotProps, sx, ...other }) {
  return (
    <Stack
      component="nav"
      id="nav-section-horizontal"
      direction="row"
      spacing={`${slotProps?.gap || 6}px`}
      {...other}
      sx={[{
        alignItems: "center",
        mx: "auto",
        ...sx
      }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}>
      {data.map((group, index) => (
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

function Group({ items, slotProps }) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </>
  );
}
