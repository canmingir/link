import { RefObject, useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: RefObject<HTMLElement | null>,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: HTMLElement | Window = element?.current ?? window;
    if (!targetElement.addEventListener) {
      return;
    }

    const eventListener = (event: Event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
}
