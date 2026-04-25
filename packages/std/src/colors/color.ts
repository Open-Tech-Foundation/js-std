import clamp from '../maths/clamp';

type RGBA = { r: number; g: number; b: number; a: number };
type HSLA = { h: number; s: number; l: number; a: number };

type ColorInput =
  | string
  | number
  | [number, number, number]
  | [number, number, number, number]
  | { r: number; g: number; b: number; a?: number }
  | { h: number; s: number; l: number; a?: number };

export const ColorFormat = {
  HEX: 'hex',
  RGB: 'rgb',
  RGBA: 'rgba',
  HSL: 'hsl',
  HSLA: 'hsla',
  RGBA_OBJ: 'rgba-object',
  RGBA_ARR: 'rgba-array',
  HSLA_OBJ: 'hsla-object',
  HSLA_ARR: 'hsla-array',
} as const;

export type ColorFormat = (typeof ColorFormat)[keyof typeof ColorFormat];

const COLOR_NAMES: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  goldenrod: '#daa520',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavenderblush: '#fff0f5',
  lavender: '#e6e6fa',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};


function hexToRgba(hex: string): RGBA | null {
  const s = hex.startsWith('#') ? hex.slice(1) : hex;
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (s.length === 3) {
    r = Number.parseInt(s[0] + s[0], 16);
    g = Number.parseInt(s[1] + s[1], 16);
    b = Number.parseInt(s[2] + s[2], 16);
  } else if (s.length === 4) {
    r = Number.parseInt(s[0] + s[0], 16);
    g = Number.parseInt(s[1] + s[1], 16);
    b = Number.parseInt(s[2] + s[2], 16);
    a = Number.parseInt(s[3] + s[3], 16) / 255;
  } else if (s.length === 6) {
    r = Number.parseInt(s.substring(0, 2), 16);
    g = Number.parseInt(s.substring(2, 4), 16);
    b = Number.parseInt(s.substring(4, 6), 16);
  } else if (s.length === 8) {
    r = Number.parseInt(s.substring(0, 2), 16);
    g = Number.parseInt(s.substring(2, 4), 16);
    b = Number.parseInt(s.substring(4, 6), 16);
    a = Number.parseInt(s.substring(6, 8), 16) / 255;
  } else {
    return null;
  }

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)) {
    return null;
  }

  return { r, g, b, a: Number(a.toFixed(2)) };
}

function hslToRgba(h: number, s: number, l: number, a = 1): RGBA {
  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  let r: number, g: number, b: number;

  if (sat === 0) {
    r = g = b = light;
  } else {
    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
    const p = 2 * light - q;
    const hue2rgb = (t: number) => {
      let tr = t;
      if (tr < 0) tr += 1;
      if (tr > 1) tr -= 1;
      if (tr < 1 / 6) return p + (q - p) * 6 * tr;
      if (tr < 1 / 2) return q;
      if (tr < 2 / 3) return p + (q - p) * (2 / 3 - tr) * 6;
      return p;
    };
    r = hue2rgb(hue + 1 / 3);
    g = hue2rgb(hue);
    b = hue2rgb(hue - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a,
  };
}

function rgbaToHsla(r: number, g: number, b: number, a = 1): HSLA {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      case blue:
        h = (red - green) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a,
  };
}

function normalize(input: ColorInput): RGBA | null {
  if (typeof input === 'string') {
    const s = input.trim().toLowerCase();
    if (COLOR_NAMES[s]) return hexToRgba(COLOR_NAMES[s]);
    if (s.startsWith('#')) return hexToRgba(s);

    const rgbMatch = s.match(
      /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)$/,
    );
    if (rgbMatch) {
      return {
        r: clamp(Number.parseInt(rgbMatch[1], 10), 0, 255),
        g: clamp(Number.parseInt(rgbMatch[2], 10), 0, 255),
        b: clamp(Number.parseInt(rgbMatch[3], 10), 0, 255),
        a: clamp(
          rgbMatch[4] === undefined ? 1 : Number.parseFloat(rgbMatch[4]),
          0,
          1,
        ),
      };
    }

    const hslMatch = s.match(
      /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)$/,
    );
    if (hslMatch) {
      return hslToRgba(
        clamp(Number.parseInt(hslMatch[1], 10), 0, 360),
        clamp(Number.parseInt(hslMatch[2], 10), 0, 100),
        clamp(Number.parseInt(hslMatch[3], 10), 0, 100),
        clamp(
          hslMatch[4] === undefined ? 1 : Number.parseFloat(hslMatch[4]),
          0,
          1,
        ),
      );
    }
  }

  if (typeof input === 'number') {
    return {
      r: (input >> 16) & 255,
      g: (input >> 8) & 255,
      b: input & 255,
      a: 1,
    };
  }

  if (Array.isArray(input)) {
    return {
      r: clamp(input[0], 0, 255),
      g: clamp(input[1], 0, 255),
      b: clamp(input[2], 0, 255),
      a: clamp(input[3] === undefined ? 1 : input[3], 0, 1),
    };
  }

  if (typeof input === 'object') {
    if ('r' in input) {
      return {
        r: clamp(input.r, 0, 255),
        g: clamp(input.g, 0, 255),
        b: clamp(input.b, 0, 255),
        a: clamp(input.a === undefined ? 1 : input.a, 0, 1),
      };
    }
    if ('h' in input) {
      return hslToRgba(
        clamp(input.h, 0, 360),
        clamp(input.s, 0, 100),
        clamp(input.l, 0, 100),
        clamp(input.a === undefined ? 1 : input.a, 0, 1),
      );
    }
  }

  return null;
}

/**
 * Parses and converts colors between various formats.
 *
 * @example
 *
 * color('#ff0000', 'rgb') //=> 'rgb(255, 0, 0)'
 * color('red', 'rgba-object') //=> { r: 255, g: 0, b: 0, a: 1 }
 * color({ h: 0, s: 100, l: 50 }, 'hex') //=> '#ff0000'
 */
export default function color(input: ColorInput, format: ColorFormat): any {
  const rgba = normalize(input);
  if (!rgba) {
    throw new Error('Invalid Color');
  }

  switch (format) {
    case 'hex': {
      const r = rgba.r.toString(16).padStart(2, '0');
      const g = rgba.g.toString(16).padStart(2, '0');
      const b = rgba.b.toString(16).padStart(2, '0');
      let a = '';
      if (rgba.a < 1) {
        a = Math.round(rgba.a * 255)
          .toString(16)
          .padStart(2, '0');
      }
      return `#${r}${g}${b}${a}`;
    }
    case 'rgb':
      return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
    case 'rgba':
      return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    case 'hsl': {
      const { h, s, l } = rgbaToHsla(rgba.r, rgba.g, rgba.b, rgba.a);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    case 'hsla': {
      const { h, s, l, a } = rgbaToHsla(rgba.r, rgba.g, rgba.b, rgba.a);
      return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }
    case 'rgba-object':
      return rgba;
    case 'rgba-array':
      return [rgba.r, rgba.g, rgba.b, rgba.a];
    case 'hsla-object':
      return rgbaToHsla(rgba.r, rgba.g, rgba.b, rgba.a);
    case 'hsla-array': {
      const { h, s, l, a } = rgbaToHsla(rgba.r, rgba.g, rgba.b, rgba.a);
      return [h, s, l, a];
    }
    default:
      throw new Error(`Invalid format: ${format}`);
  }
}
