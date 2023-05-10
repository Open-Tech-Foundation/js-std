function replaceAt(str: string, index = 0, replaceStr = ''): string {
  const rStrLen = index + (replaceStr.length === 0 ? 1 : replaceStr.length);

  return str.slice(0, index) + replaceStr + str.slice(rStrLen);
}

export default replaceAt;
