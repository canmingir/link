import React from "react";
import { SettingsContext } from "./settings-context";
import isEqual from "lodash/isEqual";
import { useLocalStorage } from "../../../hooks/use-local-storage";

import { useCallback, useMemo, useState } from "react";

// ----------------------------------------------------------------------

const STORAGE_KEY = "settings";

export function SettingsProvider({ children, defaultSettings }) {
  const { state, update, reset } = useLocalStorage(
    STORAGE_KEY,
    defaultSettings
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  // Drawer
  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, defaultSettings);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onUpdate: update,
      // Direction
      // Reset
      canReset,
      onReset: reset,
      // Drawer
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [reset, update, state, canReset, openDrawer, onCloseDrawer, onToggleDrawer]
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
