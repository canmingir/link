import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { RouterLink } from "../../routes/components";
import config from "../../config/config";

import React, { useEffect, useRef, useState } from "react";

const resolvedDimensions = {};

const Logo = ({ disabledLink = false, sx, maxSize = 65, isLogin = false }) => {
  const { icon } = config().template.login;
  const key = `${icon}`;

  const [dimensions, setDimensions] = useState(
    resolvedDimensions[key] || { width: maxSize, height: maxSize }
  );

  useEffect(() => {
    if (!icon || resolvedDimensions[key]) return;

    const img = new Image();
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      const isSquare = naturalWidth === naturalHeight;
      let newDimensions;

      if (naturalWidth > maxSize || naturalHeight > maxSize) {
        if (isSquare) {
          newDimensions = {
            width: isLogin ? maxSize : 40,
            height: isLogin ? maxSize : 40,
          };
        } else {
          const aspectRatio = naturalWidth / naturalHeight;
          if (naturalWidth >= naturalHeight) {
            newDimensions = {
              width: maxSize,
              height: Math.round(maxSize / aspectRatio),
            };
          } else {
            newDimensions = {
              width: Math.round(maxSize * aspectRatio),
              height: maxSize,
            };
          }
        }
      } else {
        newDimensions = { width: naturalWidth, height: naturalHeight };
      }

      resolvedDimensions[key] = newDimensions;
      setDimensions(newDimensions);
    };
    img.src = icon;
  }, [icon, maxSize, key]);

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

  if (disabledLink) return logo;

  return (
    <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
      {logo}
    </Link>
  );
};

export default Logo;
