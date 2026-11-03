import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T extends Record<string, unknown>>(
  key: string,
  initialState: T
) {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const restored = getStorageAll(key, initialState);

    setState((prevValue) => ({
      ...prevValue,
      ...restored,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const updateState = useCallback(
    (updateValue: Partial<T>) => {
      setState((prevValue) => {
        setStorageAll(key, updateValue);

        return {
          ...prevValue,
          ...updateValue,
        };
      });
    },
    [key]
  );

  const update = useCallback(
    (name: keyof T, updateValue: T[keyof T]) => {
      updateState({
        [name]: updateValue,
      } as Partial<T>);
    },
    [updateState]
  );

  const reset = useCallback(() => {
    removeStorageAll(key, initialState);
    setState(initialState);
  }, [initialState, key]);

  return {
    state,
    update,
    reset,
  };
}

const storageKey = (key: string, field: string) => `${key}.${field}`;

const getStorageAll = <T extends Record<string, unknown>>(
  key: string,
  initialState: T
) => {
  const value: Partial<T> = {};

  Object.keys(initialState).forEach((field) => {
    const restored = getStorage(storageKey(key, field));

    if (restored !== null) {
      value[field as keyof T] = restored;
    }
  });

  return value;
};

const setStorageAll = <T extends Record<string, unknown>>(
  key: string,
  updateValue: Partial<T>
) => {
  Object.keys(updateValue).forEach((field) => {
    setStorage(storageKey(key, field), updateValue[field as keyof T]);
  });
};

const removeStorageAll = <T extends Record<string, unknown>>(
  key: string,
  initialState: T
) => {
  Object.keys(initialState).forEach((field) => {
    removeStorage(storageKey(key, field));
  });
};

export const getStorage = (key: string) => {
  let value = null;

  try {
    const result = window.localStorage.getItem(key);

    if (result !== null) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
