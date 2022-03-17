import { ObjType } from '../ObjType';

function getInObj(obj: ObjType, path: string): unknown {
  let currentPath: unknown = obj;
  const props = path.match(/(\w+)/g);

  if (!props) return;

  for (let i = 0; i < props.length; i++) {
    currentPath = (currentPath as ObjType)[props[i]];

    if (currentPath === undefined) return;
  }

  return currentPath;
}

export default getInObj;
