import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    lighter: string;
    darker: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }

  interface TypeBackground {
    neutral: string;
  }

  interface Palette {
    custom?: Record<string, any>;
  }

  interface PaletteOptions {
    custom?: Record<string, any>;
  }

  interface Color {
    0: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }

  interface TypographyVariants {
    fontWeightSemiBold: number;
    fontSecondaryFamily?: string;
  }

  interface TypographyVariantsOptions {
    fontWeightSemiBold?: number;
    fontSecondaryFamily?: string;
  }

  interface Theme {
    customShadows: Record<string, string>;
    custom?: Record<string, any>;
  }

  interface ThemeOptions {
    customShadows?: Record<string, string>;
    custom?: Record<string, any>;
  }
}
