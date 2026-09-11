import { createContext, useContext } from "react";

export type SettingsValueProps = {
  themeMode: "light" | "dark";
  themeDirection: "ltr" | "rtl";
  themeContrast: "default" | "bold";
  themeLayout: "vertical" | "horizontal" | "mini";
  themeColorPresets: "default" | "cyan" | "purple" | "blue" | "orange" | "red";
  themeStretch: boolean;
  beta?: boolean;
};

export type SettingsContextProps = SettingsValueProps & {
  onUpdate: (name: string, value: unknown) => void;
  canReset: boolean;
  onReset: VoidFunction;
  open: boolean;
  onClose: VoidFunction;
  onToggle: VoidFunction;
};

export const SettingsContext = createContext<SettingsContextProps>(
  {} as SettingsContextProps
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context)
    throw new Error("useSettingsContext must be use inside SettingsProvider");

  return context;
};
