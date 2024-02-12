export type GroupKey<T> = ((a: T) => string) | string;

export default function groupBy<T>(
  arr: T[],
  key: GroupKey<T>
): Record<string, T[]> {
  return arr.reduce((acc: Record<string, T[]>, obj: T) => {
    const k =
      typeof key === 'function' ? key(obj) : (obj[key as keyof T] as string);
    const curGroup = acc[k] ?? [];
    return { ...acc, [k]: [...curGroup, obj] };
  }, {});
}
