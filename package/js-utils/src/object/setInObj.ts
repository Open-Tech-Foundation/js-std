import { ObjType } from '../ObjType';
import isNumber from '../types/isNumber';

function setInObj(obj: ObjType, path: string, value: unknown): ObjType {
  let tempPath: ObjType = obj;
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
      tempPath[prop] = isNumber(props[i + 1]) ? [] : {};
    }

    tempPath = tempPath[prop] as ObjType;
  }

  return obj;
}

export default setInObj;
