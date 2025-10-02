import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { RouterLink } from "../../routes/components";
import config from "../../config/config";

import React, { useEffect, useState } from "react";

const Logo = ({ disabledLink = false, sx, maxSize = 99 }) => {
  const { icon } = config().template.login;
  const [dimensions, setDimensions] = useState({
    width: maxSize,
    height: maxSize,
  });

  useEffect(() => {
    if (icon) {
      const img = new Image();
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;

        if (naturalWidth > maxSize || naturalHeight > maxSize) {
          setDimensions({
            width: 40,
            height: 40,
          });
        } else {
          setDimensions({
            width: naturalWidth,
            height: naturalHeight,
          });
        }
      };
      img.src = icon;
    }
  }, [icon, maxSize]);

  const logo = (
    <Box
      component="img"
      src={icon}
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        cursor: "pointer",
        ...sx,
      }}
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
