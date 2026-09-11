import { useScroll } from "framer-motion";

import { useCallback, useEffect, useMemo, useState } from "react";

type UseScrollOptions = Parameters<typeof useScroll>[0];

export function useOffSetTop(top = 0, options?: UseScrollOptions) {
  const { scrollY } = useScroll(options);

  const [value, setValue] = useState(false);

  const onOffSetTop = useCallback(() => {
    scrollY.on("change", (scrollHeight) => {
      if (scrollHeight > top) {
        setValue(true);
      } else {
        setValue(false);
      }
    });
  }, [scrollY, top]);

  useEffect(() => {
    onOffSetTop();
  }, [onOffSetTop]);

  const memoizedValue = useMemo(() => value, [value]);

  return memoizedValue;
}
