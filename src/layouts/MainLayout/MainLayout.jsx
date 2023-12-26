import Box from "@mui/material/Box";
import Header from "./header";
import { Outlet } from "react-router";
import React from "react";
import { useConfig } from "../../context/ConfigContext";
import { useContext } from "../../ContextProvider/ContextProvider";
import { usePathname } from "../../routes/hooks";

// ----------------------------------------------------------------------

export default function MainLayout() {
  const pathname = usePathname();

  const [state, dispatch] = useContext();
  const [selectedItem, setSelectedItem] = React.useState();
  const globalConfig = useConfig();
  const homePage = pathname === "/";

  React.useEffect(() => {
    const foundItem = globalConfig.itemsData.find(
      (item) => item.id === state.itemId
    );
    if (foundItem) {
      setSelectedItem(foundItem);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemSelect = (item) => {
    dispatch({ type: "ITEM_SELECT", payload: item.id });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: 1 }}>
      <Header
        handleItemSelect={handleItemSelect}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!homePage && {
            pt: { xs: 8, md: 10 },
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
