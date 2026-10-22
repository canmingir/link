import { flattenArray } from "../../../utils/flatten-array";

/** A nav entry as consumed by the project bar search. */
export interface NavItem {
  title: string;
  path?: string;
  subheader?: string;
  children?: NavItem[];
  [key: string]: unknown;
}

export function getAllItems({
  data,
}: {
  data: { subheader: string; items: NavItem[] }[];
}): { group?: string; title: string; path?: string }[] {
  const reduceItems = data
    .map((list) => handleLoop(list.items, list.subheader))
    .flat();

  const items = (flattenArray(reduceItems) ?? []).map((option: NavItem) => {
    const group = splitPath(reduceItems, option.path);

    return {
      group: group && group.length > 1 ? group[0] : option.subheader,
      title: option.title,
      path: option.path,
    };
  });

  return items;
}

export function applyFilter<T extends { name: string }>({
  inputData,
  query,
}: {
  inputData: T[];
  query?: string;
}): T[] {
  if (query) {
    return inputData.filter(
      (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export function splitPath(
  array: NavItem[],
  key: string | undefined
): string[] | null {
  let stack = array.map((item) => ({
    path: [item.title],
    currItem: item,
  }));

  while (stack.length) {
    const { path, currItem } = stack.pop()!;

    if (currItem.path === key) {
      return path;
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map((item) => ({
          path: path.concat(item.title),
          currItem: item,
        }))
      );
    }
  }
  return null;
}

export function handleLoop(
  array: NavItem[] | undefined,
  subheader: string
): NavItem[] {
  return (array ?? []).map((list) => ({
    subheader,
    ...list,
    ...(list.children && {
      children: handleLoop(list.children, subheader),
    }),
  }));
}

export function groupedData(
  array: { group?: string; title: string; path?: string }[]
): Record<string, { group?: string; title: string; path?: string }[]> {
  const group = array.reduce<
    Record<string, { group?: string; title: string; path?: string }[]>
  >((groups, item) => {
    const key = item.group ?? "";
    groups[key] = groups[key] || [];

    groups[key].push(item);

    return groups;
  }, {});

  return group;
}
