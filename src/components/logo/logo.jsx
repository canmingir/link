import React, { useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { RouterLink } from "../../routes/components";
import config from "../../config/config";

const Logo = ({ disabledLink = false, sx, maxSize = 65, isLogin = false }) => {
  const { icon } = config().template.login;

  const [isSquare, setIsSquare] = useState(false);
  const squareCap = isSquare && !isLogin ? 40 : maxSize;

  const logo = (
    <Box
      component="img"
      src={icon}
      onLoad={(e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setIsSquare(naturalWidth === naturalHeight);
      }}
      sx={{
        maxWidth: squareCap,
        maxHeight: squareCap,
        width: "auto",
        height: "auto",
        objectFit: "contain",
        cursor: "pointer",
        ...sx,
      }}
    />
  );

  if (disabledLink) return logo;

  return (
    <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
      {logo}
    </Link>
  );
};

export default Logo;
