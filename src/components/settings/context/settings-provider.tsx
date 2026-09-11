import type { ReactNode } from "react";
import { SettingsContext } from "./settings-context";
import type { SettingsValueProps } from "./settings-context";
import isEqual from "lodash/isEqual";
import { useLocalStorage } from "../../../hooks/use-local-storage";

import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY = "link.settings";

interface SettingsProviderProps {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
}

export function SettingsProvider({
  children,
  defaultSettings,
}: SettingsProviderProps) {
  const { state, update, reset } = useLocalStorage(
    STORAGE_KEY,
    defaultSettings
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, defaultSettings);

  const onUpdate = useCallback(
    (name: string, value: unknown) => {
      update(
        name as keyof SettingsValueProps,
        value as SettingsValueProps[keyof SettingsValueProps]
      );
    },
    [update]
  );

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onUpdate,
      canReset,
      onReset: reset,
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [
      reset,
      onUpdate,
      state,
      canReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    ]
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
