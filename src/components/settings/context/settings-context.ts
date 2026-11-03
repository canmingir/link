import { createContext, useContext } from "react";

export type SettingsValueProps = {
  thememode: "light" | "dark";
  themedirection: "ltr" | "rtl";
  themecontrast: "default" | "bold";
  themelayout: "vertical" | "horizontal" | "mini";
  themecolorpresets: "default" | "cyan" | "purple" | "blue" | "orange" | "red";
  themestretch: boolean;
  beta?: boolean;
  animation?: boolean;
};

type SettingsContextValue = SettingsValueProps & {
  onUpdate: (name: string, value: unknown) => void;
  canReset: boolean;
  onReset: VoidFunction;
  open: boolean;
  onClose: VoidFunction;
  onToggle: VoidFunction;
};

export const SettingsContext = createContext<SettingsContextValue>(
  {} as SettingsContextValue
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context)
    throw new Error("useSettingsContext must be use inside SettingsProvider");

  return context;
};
