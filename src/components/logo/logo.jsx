import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import React from "react";
import { RouterLink } from "../../routes/components";
import config from "../../config/config";
// ----------------------------------------------------------------------

const Logo = ({ disabledLink = false, sx }) => {
  const { icon } = config().template.login;

  const logo = (
    <Box
      component="img"
      src={icon}
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
};

export default Logo;
