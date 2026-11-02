declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.svg?react" {
  import * as React from "react";
  const C: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default C;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "*.css";
