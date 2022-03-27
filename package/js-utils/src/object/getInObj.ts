export default function getInObj(obj: object, path: string): unknown {
  let currentPath = obj;
  const props = path.match(/(\w+)/g);

  if (!props) return;

  for (let i = 0; i < props.length; i++) {
    currentPath = currentPath[props[i] as keyof typeof currentPath];

    if (currentPath === undefined) return;
  }

  return currentPath;
}
