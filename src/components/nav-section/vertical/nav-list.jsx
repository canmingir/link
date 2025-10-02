import Collapse from "@mui/material/Collapse";
import NavItem from "./nav-item";
import React from "react";
import { useActiveLink } from "../../../routes/hooks";
import { usePathname } from "../../../routes/hooks";

import { useCallback, useEffect, useState } from "react";

export default function NavList({ data, depth }) {
  const pathname = usePathname();
  const active = useActiveLink(data.path, !!data.children);
  const [openMenu, setOpenMenu] = useState(active);
  useEffect(() => {
    if (!active) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data?.children) {
      setOpenMenu((prev) => !prev);
    }
  }, [data?.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);
  return (
    <>
      <NavItem
        open={openMenu}
        onClick={handleToggleMenu}
        title={data?.title}
        path={data?.path}
        icon={data?.icon}
        info={data?.info}
        roles={data?.roles}
        caption={data?.caption}
        disabled={data?.disabled}
        external={data?.external}
        depth={depth}
        hasChild={!!data?.children}
        externalLink={data?.path?.includes("http")}
        active={active}
        className={active ? "active" : ""}
      />

      {!!data.children && (
        <Collapse in={openMenu} unmountOnExit>
          <NavSubList data={data.children} depth={depth} />
        </Collapse>
      )}
    </>
  );
}

function NavSubList({ data, depth }) {
  return (
    <>
      {data?.map((list) => (
        <NavList key={list?.title} data={list} depth={depth + 1} />
      ))}
    </>
  );
}
