declare module "@nucleoidai/react-event" {
  export function publish(event: string, ...args: unknown[]): void;
  export function subscribe(
    event: string,
    handler: (...args: unknown[]) => void
  ): () => void;
  export function useEvent<T = unknown>(
    event: string,
    initialValue?: T
  ): [T, (value: T) => void];
}

declare module "@nucleoidjs/webstorage" {
  export const storage: {
    get(namespace: string, key: string): any;
    set(namespace: string, key: string, value: unknown): void;
    remove(namespace: string, key: string): void;
    clear(namespace?: string): void;
  };
  export function useStorage<T = any>(
    namespace: string,
    key: string,
    initialValue?: T
  ): [T, (value: T) => void];
}
