import type { ComponentType } from "react";

export type OAuthProviderConfig = {
  authUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  response_type: string;
  userUrl: string;
};

export type MainConfig = {
  appId: string;
  name: string;
  beta?: boolean;
  base: string;
  api: string;
  socket?: {
    host: string;
    path: string;
  };
  credentials?: {
    provider: "DEMO" | "COGNITO";
    region?: string;
    userPoolId?: string;
    clientId?: string;
    requestUrl?: string;
  };
  project?: {
    nucleoid?: Record<string, unknown>;
    github?: OAuthProviderConfig;
    google?: OAuthProviderConfig;
    linkedin?: OAuthProviderConfig;
  };
};

export type MenuItem = {
  title: string;
  compactTitle?: string;
  icon: string;
  path: string;
  external?: boolean;
  children?: Array<{
    title: string;
    path: string;
    icon: string;
    external?: boolean;
  }>;
};

export type MenuConfig = {
  sideMenu: Array<{ subheader: string; items: MenuItem[] }>;
  topMenu: Array<{ title: string; icon: string; path: string }>;
  options: Array<{ label: string; linkTo: string }>;
  actionButtons: ComponentType[];
  topBar?: ComponentType;
  fullScreenLayout: "left" | "right" | "top";
};

export type TemplateConfig = {
  login?: {
    variant: "classic" | "modern" | "special";
    image: string;
    largeIcon: string;
    icon: string;
  };
  theme: {
    variants?: (...args: unknown[]) => unknown;
    mode: "light" | "dark";
    colorPresets: "default" | "cyan" | "purple" | "blue" | "orange" | "red";
  };
  projectBar?: { label: string };
  icon: string;
  settings: {
    tabs: Array<{ label: string; panel: ComponentType }>;
  };
};

export type LinkConfig = MainConfig & {
  menu: MenuConfig;
  template: TemplateConfig;
};
