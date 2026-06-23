import { Link } from "react-router-dom";
import React from "react";
import { forwardRef } from "react";

const RouterLink = forwardRef(({ href, ...other }, ref) => (
  <Link ref={ref} to={href} {...other} />
));

export default RouterLink;
