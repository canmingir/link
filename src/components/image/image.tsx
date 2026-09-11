import Box from "@mui/material/Box";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { ReactNode } from "react";
import { forwardRef } from "react";
import { getRatio } from "./utils";

import type { SxProps, Theme } from "@mui/material/styles";
import { alpha, useTheme } from "@mui/material/styles";

interface ImageProps {
  ratio?: string;
  overlay?: string;
  disabledEffect?: boolean;
  alt?: string;
  src?: string;
  afterLoad?: () => void;
  delayTime?: number;
  threshold?: number;
  beforeLoad?: () => void;
  delayMethod?: "debounce" | "throttle";
  placeholder?: ReactNode;
  wrapperProps?: Record<string, unknown>;
  scrollPosition?: { x: number; y: number };
  effect?: string;
  visibleByDefault?: boolean;
  wrapperClassName?: string;
  useIntersectionObserver?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
  style?: React.CSSProperties;
}

const Image = forwardRef<HTMLSpanElement, ImageProps>(
  (
    {
      ratio,
      overlay,
      disabledEffect = false,
      alt,
      src,
      afterLoad,
      delayTime,
      threshold,
      beforeLoad,
      delayMethod,
      placeholder,
      wrapperProps,
      scrollPosition,
      effect = "blur",
      visibleByDefault,
      wrapperClassName,
      useIntersectionObserver,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const overlayStyles = !!overlay && {
      "&:before": {
        content: "''",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 1,
        position: "absolute",
        background: overlay || alpha(theme.palette.grey[900], 0.48),
      },
    };

    const LazyBox = Box as unknown as React.ComponentType<
      Record<string, unknown>
    >;

    const content = (
      <LazyBox
        component={LazyLoadImage}
        alt={alt}
        src={src}
        afterLoad={afterLoad}
        delayTime={delayTime}
        threshold={threshold}
        beforeLoad={beforeLoad}
        delayMethod={delayMethod}
        placeholder={placeholder}
        wrapperProps={wrapperProps}
        scrollPosition={scrollPosition}
        visibleByDefault={visibleByDefault}
        effect={disabledEffect ? undefined : effect}
        useIntersectionObserver={useIntersectionObserver}
        wrapperClassName={wrapperClassName || "component-image-wrapper"}
        placeholderSrc={
          disabledEffect ? "/assets/transparent.png" : "/assets/placeholder.svg"
        }
        sx={{
          width: 1,
          height: 1,
          objectFit: "cover",
          verticalAlign: "bottom",
          ...(!!ratio && {
            top: 0,
            left: 0,
            position: "absolute",
          }),
        }}
      />
    );

    return (
      <Box
        ref={ref}
        component="span"
        className="component-image"
        sx={{
          overflow: "hidden",
          position: "relative",
          verticalAlign: "bottom",
          display: "inline-block",
          ...(!!ratio && {
            width: 1,
          }),
          "& span.component-image-wrapper": {
            width: 1,
            height: 1,
            verticalAlign: "bottom",
            backgroundSize: "cover !important",
            ...(!!ratio && {
              pt: getRatio(ratio),
            }),
          },
          ...overlayStyles,
          ...sx,
        }}
        {...other}
      >
        {content}
      </Box>
    );
  }
);

export default Image;
