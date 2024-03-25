function insertAt(str: string, index = 0, insertStr = ''): string {
  return str.slice(0, index) + insertStr + str.slice(index);
}

export default insertAt;
