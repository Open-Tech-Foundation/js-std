function replaceAt(str: string, index: number, replaceStr = ''): string {
  const rStrLen = index + (replaceStr.length === 0 ? 1 : replaceStr.length);

  if (str.length === 0) {
    return '';
  }

  const result = str.substring(0, index) + replaceStr + str.substring(rStrLen);

  if (typeof index !== 'number') {
    return str;
  }

  return result;
}

export default replaceAt;
