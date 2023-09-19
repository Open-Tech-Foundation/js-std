export type GroupKey = (a: unknown) => string | string;

export default function groupBy(arr: unknown[], key: GroupKey) {
  return arr.reduce((acc: Record<string, unknown>, obj) => {
    const k =
      typeof key === 'function' ? key(obj) : (obj as Iterable<unknown>)[key];
    const curGroup = acc[k] ?? [];
    return { ...acc, [k]: [...(curGroup as unknown[]), obj] };
  }, {});
}
