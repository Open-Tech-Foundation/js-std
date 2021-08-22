function rmSep(str: string): string {
  const regExpStr = '(_{1})(?=[0-9A-F]+)';
  const regExp = new RegExp(regExpStr, 'g');

  if (str.match(regExpStr)) {
    let output = '';
    let curIndex = 0;
    let match;

    while ((match = regExp.exec(str)) !== null) {
      output += str.substring(curIndex, match.index);
      curIndex = match.index + 1;
    }

    output += str.substring(curIndex);

    return output;
  }

  return str;
}

function isNumber(value: unknown): boolean {
  if (typeof value === 'number') return true;

  if (typeof value === 'string') {
    if (value.length === 0 || value.trim().length === 0) return false;

    const curValue = rmSep(value);
    const toNum = Number(curValue);

    if (!Number.isNaN(toNum)) {
      return true;
    }
  }

  return false;
}

export default isNumber;
