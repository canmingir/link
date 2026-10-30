import type { Easing } from "framer-motion";

export interface AnimateVariantProps {
  durationIn?: number;
  durationOut?: number;
  easeIn?: Easing;
  easeOut?: Easing;
  distance?: number;
  staggerIn?: number;
}
