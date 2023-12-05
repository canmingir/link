import Box from "@mui/material/Box";
import Footer from "./footer";
import Header from "./header";
import { Outlet } from "react-router";
import PropTypes from "prop-types";
import { usePathname } from "../../routes/hooks";
// ----------------------------------------------------------------------

export default function MainLayout() {
  const pathname = usePathname();

  const homePage = pathname === "/";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: 1 }}>
      <Header />

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

      <Footer />
    </Box>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
