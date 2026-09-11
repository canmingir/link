import Box from "@mui/material/Box";
import type { BreadcrumbLink } from "./CustomBreadcrumbs";
import Link from "@mui/material/Link";
import RouterLink from "../../routes/components/router-link";

interface BreadcrumbsLinkProps {
  link: BreadcrumbLink;
  activeLast?: boolean;
  disabled?: boolean;
}

export default function BreadcrumbsLink({
  link,
  activeLast,
  disabled,
}: BreadcrumbsLinkProps) {
  const styles = {
    typography: "body2",
    alignItems: "center",
    color: "text.primary",
    display: "inline-flex",
    ...(disabled &&
      !activeLast && {
        cursor: "default",
        pointerEvents: "none",
        color: "text.disabled",
      }),
  };

  const renderContent = (
    <>
      {link.icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            display: "inherit",
            "& svg": { width: 20, height: 20 },
          }}
        >
          {link.icon}
        </Box>
      )}

      {link.name}
    </>
  );

  if (link.href) {
    return (
      <Link component={RouterLink} href={link.href} sx={styles}>
        {renderContent}
      </Link>
    );
  }

  return <Box sx={styles}> {renderContent} </Box>;
}
