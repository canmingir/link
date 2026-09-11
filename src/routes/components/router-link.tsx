import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { forwardRef } from "react";

interface RouterLinkProps extends Omit<LinkProps, "to" | "href"> {
  href?: string;
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href, ...other }, ref) => <Link ref={ref} to={href ?? ""} {...other} />
);

export default RouterLink;
