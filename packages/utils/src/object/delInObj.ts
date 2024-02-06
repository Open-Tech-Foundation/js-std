export default function delInObj(obj: unknown, path: string) {
  let tmpObj: unknown = obj;
  const props = path.match(/(\w+)/g);

  if (!props) {
    return false;
  }

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (!Object.prototype.hasOwnProperty.call(tmpObj, prop)) {
      return false;
    }

    if (i === props.length - 1) {
      if (Array.isArray(tmpObj)) {
        tmpObj.splice(+prop, 1);
        return true;
      }
      return delete (tmpObj as Record<string, unknown>)[prop];
    }

    tmpObj = (tmpObj as Record<string, unknown>)[prop];
  }

  return false;
}
