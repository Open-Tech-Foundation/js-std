import capitalize from './capitalize';
import replaceAt from './replaceAt';

function camelCase(str: string): string {
  let out;
  const res = str.match(/[a-z0-9]+/gi);

  const wordCase = (word: string) => {
    const regexp = new RegExp(/[A-Z]+/g);
    let match;

    while ((match = regexp.exec(word)) !== null) {
      if (regexp.lastIndex && regexp.lastIndex < word.length) {
        word =
          word.substring(0, match.index) +
          capitalize(word.substring(match.index, regexp.lastIndex - 1)) +
          word.substring(regexp.lastIndex - 1);
      } else {
        return word.substring(0, match.index) + capitalize(match[0]);
      }
    }

    return word;
  };

  if (res) {
    for (let i = 0; i < res.length; i++) {
      if (res[i].match(/[A-Z]+/g)) {
        res[i] = wordCase(res[i]);
      } else {
        res[i] = capitalize(res[i]);
      }
    }
    out = res.join('');

    return replaceAt(out, 0, out[0].toLowerCase());
  }

  return str;
}

export default camelCase;
