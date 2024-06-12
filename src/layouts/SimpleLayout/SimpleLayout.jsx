import Header from "../common/header-simple";
import { Outlet } from "react-router";
import PropTypes from "prop-types";
import React from "react";
import config from "../../../../../config";
import { useContext } from "../../ContextProvider/ContextProvider";
// ----------------------------------------------------------------------

export default function SimpleLayout() {
  const [state, dispatch] = useContext();
  const [selectedItem, setSelectedItem] = React.useState();

  // TODO config.itemsData is not defined ??
  React.useEffect(() => {
    const foundItem = config.itemsData.find((item) => item.id === state.itemId);

    if (foundItem) {
      setSelectedItem(foundItem);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.itemId]);
  const handleItemSelect = (item) => {
    dispatch({ type: "ITEM_SELECT", payload: item.id });
  };
  return (
    <>
      <Header
        handleItemSelect={handleItemSelect}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      <Outlet />
    </>
  );
}

SimpleLayout.propTypes = {
  children: PropTypes.node,
};
