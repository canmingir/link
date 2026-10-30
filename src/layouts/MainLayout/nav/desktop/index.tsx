import NavList from "./nav-list";
import type { NavListData } from "../types";
import Stack from "@mui/material/Stack";

export default function NavDesktop({ data }: { data: NavListData[] }) {
  return (
    <Stack
      component="nav"
      direction="row"
      spacing={5}
      sx={{ mr: 2.5, height: 1 }}
    >
      {data.map((list) => (
        <NavList key={list.title} data={list} />
      ))}
    </Stack>
  );
}
