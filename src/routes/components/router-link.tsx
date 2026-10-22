import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { forwardRef } from "react";

const RouterLink = forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "to" | "href"> & { href?: string }
>(({ href, ...other }, ref) => <Link ref={ref} to={href ?? ""} {...other} />);

export default RouterLink;
