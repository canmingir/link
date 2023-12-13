import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import PropTypes from "prop-types";
import React from "react";
import { RouterLink } from "../../routes/components";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx }) => {
  const logo = (
    <Box
      component="img"
      src="./media/logo.png"
      sx={{ width: 40, height: 40, cursor: "pointer", ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
