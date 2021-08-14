function insertAt(str: string, index: number, insertStr = ''): string {
  if (str.length === 0) {
    return '';
  }

  const result = str.substring(0, index) + insertStr + str.substring(index);

  if (typeof index !== 'number') {
    return str;
  }

  return result;
}

export default insertAt;
