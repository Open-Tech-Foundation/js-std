function isEmail(str) {
    const regex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    const result = regex.exec(str);
    return result ? result[0] === str : false;
}

function replaceAt(str, index, replaceStr = '') {
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

function insertAt(str, index, insertStr = '') {
    if (str.length === 0) {
        return '';
    }
    const result = str.substring(0, index) + insertStr + str.substring(index);
    if (typeof index !== 'number') {
        return str;
    }
    return result;
}

function capitalize(str) {
    if (str.length === 0) {
        return '';
    }
    let result = str.toLowerCase();
    result = replaceAt(result, 0, result[0].toUpperCase());
    return result;
}

function camelCase(str) {
    let out;
    const res = str.match(/[a-z0-9]+/gi);
    const wordCase = (word) => {
        const regexp = new RegExp(/[A-Z]+/g);
        let match;
        while ((match = regexp.exec(word)) !== null) {
            if (regexp.lastIndex && regexp.lastIndex < word.length) {
                word =
                    word.substring(0, match.index) +
                        capitalize(word.substring(match.index, regexp.lastIndex - 1)) +
                        word.substring(regexp.lastIndex - 1);
            }
            else {
                return word.substring(0, match.index) + capitalize(match[0]);
            }
        }
        return word;
    };
    if (res) {
        for (let i = 0; i < res.length; i++) {
            if (res[i].match(/[A-Z]+/g)) {
                res[i] = wordCase(res[i]);
            }
            else {
                res[i] = capitalize(res[i]);
            }
        }
        out = res.join('');
        return replaceAt(out, 0, out[0].toLowerCase());
    }
    return str;
}

function pascalCase(str) {
    const result = camelCase(str);
    return replaceAt(result, 0, result[0].toUpperCase());
}

function arrayDiff(arr1, arr2) {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
        let skip = false;
        for (let j = 0; j < arr2.length; j++) {
            if (Object.is(arr1[i], arr2[j])) {
                skip = true;
            }
        }
        if (!skip) {
            result.push(arr1[i]);
        }
    }
    return result;
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function percentage(value, total, floor) {
    if (floor) {
        return Math.floor((value / total) * 100);
    }
    return (value / total) * 100;
}

function percentageOf(percentage, num, floor) {
    if (floor) {
        return Math.floor((percentage / 100) * num);
    }
    return (percentage / 100) * num;
}

function rmSep(str) {
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
function isNumber(value) {
    if (typeof value === 'number')
        return true;
    if (typeof value === 'string') {
        if (value.length === 0 || value.trim().length === 0)
            return false;
        const curValue = rmSep(value);
        const toNum = Number(curValue);
        if (!Number.isNaN(toNum)) {
            return true;
        }
    }
    return false;
}

function inferType(str) {
    if (typeof str === 'string') {
        if (str === '') {
            return 'string';
        }
        if (str === 'undefined' || str === 'Undefined') {
            return 'undefined';
        }
        if (str === 'null' || str === 'Null' || str === 'NULL') {
            return 'null';
        }
        const booleans = ['true', 'True', 'TRUE', 'false', 'False', 'FALSE'];
        if (booleans.includes(str)) {
            return 'boolean';
        }
        if (isNumber(str)) {
            return 'number';
        }
        return 'string';
    }
    return 'unknown';
}

export { arrayDiff, camelCase, capitalize, inferType, insertAt, isEmail, isNumber, pascalCase, percentage, percentageOf, replaceAt, sleep };
