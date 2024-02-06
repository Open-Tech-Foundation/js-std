import isObj from '../types/isObj';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function cloneObj(obj: any): any {
  if (typeof obj !== 'object') {
    return obj;
  }

  if (isObj(obj)) {
    const cObj: Record<string, unknown> = {};
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        cObj[k] = cloneObj(obj[k as keyof typeof obj]);
      }
    }

    return cObj;
  }

  if (Array.isArray(obj)) {
    const arr = [];
    for (const i of obj) {
      arr.push(cloneObj(i));
    }

    return arr;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  return obj;
}
