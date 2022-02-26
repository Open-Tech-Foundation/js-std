export default function isObjType(obj: unknown): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
