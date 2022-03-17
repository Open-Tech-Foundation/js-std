import isObjType from './isObjType';

export default function cloneObj(obj: unknown): unknown {
  if (typeof obj !== 'object') {
    return obj;
  }

  if (isObjType(obj)) {
    const cObj: Record<string, unknown> = {};
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        cObj[k] = cloneObj((obj as Record<string, unknown>)[k]);
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
