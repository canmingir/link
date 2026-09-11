export function flattenArray<T extends Record<string, unknown>>(
  list: T[] | undefined,
  key = "children"
): T[] | undefined {
  let children: T[] = [];

  const flatten = list?.map((item) => {
    const nested = item[key];
    if (Array.isArray(nested) && nested.length) {
      children = [...children, ...(nested as T[])];
    }
    return item;
  });

  return flatten?.concat(
    (children.length ? flattenArray(children, key) : children) as T[]
  );
}
