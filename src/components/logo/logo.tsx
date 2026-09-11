import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { RouterLink } from "../../routes/components";
import config from "../../config/config";
import { useState } from "react";

import type { SxProps, Theme } from "@mui/material/styles";

interface LogoProps {
  disabledLink?: boolean;
  sx?: SxProps<Theme>;
  maxSize?: number;
  isLogin?: boolean;
}

const Logo = ({
  disabledLink = false,
  sx,
  maxSize = 100,
  isLogin = false,
}: LogoProps) => {
  const icon = config().template.login?.icon;

  const [isSquare, setIsSquare] = useState(false);
  const squareCap = isSquare && !isLogin ? 40 : maxSize;

  const logo = (
    <Box
      component="img"
      src={icon}
      onLoad={(e) => {
        const img = e.currentTarget as unknown as HTMLImageElement;
        setIsSquare(img.naturalWidth === img.naturalHeight);
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
