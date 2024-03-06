import isNum from '../types/isNum';

function setInObj(obj: object, path: string, value: unknown): object {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tempPath: any = obj;
  const props = path.match(/(\w+)/g);

  if (!props) {
    return obj;
  }

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];

    if (i === props.length - 1) {
      tempPath[prop] = value;
      continue;
    }

    if (!tempPath[prop]) {
      tempPath[prop] = isNum(props[i + 1], true) ? [] : {};
    }

    tempPath = tempPath[prop];
  }

  return obj;
}

export default setInObj;
