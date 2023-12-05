import Header from "../common/header-simple";
import { Outlet } from "react-router";
import PropTypes from "prop-types";
// ----------------------------------------------------------------------

export default function SimpleLayout() {
  return (
    <>
      <Header />

      <Outlet />
    </>
  );
}

SimpleLayout.propTypes = {
  children: PropTypes.node,
};
