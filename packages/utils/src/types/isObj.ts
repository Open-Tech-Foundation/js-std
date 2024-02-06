export default function isObj(obj: unknown): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
