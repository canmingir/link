import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Logo from "../../../../components/logo";
import NavList from "./nav-list";
import PropTypes from "prop-types";
import Scrollbar from "../../../../components/scrollbar";
import SvgColor from "../../../../components/svg-color";
import { usePathname } from "../../../../routes/hooks";
import React from "react";

import { useCallback, useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function NavMobile({ data }) {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  return (
    <>
      <IconButton onClick={handleOpenMenu} sx={{ ml: 1 }}>
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
      </IconButton>

      <Drawer
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          {data.map((list) => (
            <NavList key={list.title} data={list} />
          ))}
        </Scrollbar>
      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
};
