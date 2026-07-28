import stripDiacritics from './stripDiacritics';

/**
 * Converts a string into a URL-friendly slug.
 *
 * Diacritics are transliterated rather than stripped, so a letter with no
 * Unicode decomposition — `ø`, `ß`, `ł`, `đ` — becomes its ASCII equivalent
 * instead of being dropped from the slug.
 *
 * @param {string} str The string to slugify.
 * @returns {string} The slug.
 *
 * @example
 * slugify('Hello World!') //=> 'hello-world'
 * slugify('Café au Lait') //=> 'cafe-au-lait'
 *
 * @example
 * slugify('Straße') //=> 'strasse'
 * slugify('Ølberg') //=> 'olberg'
 */
export default function slugify(str: string): string {
  return stripDiacritics(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric (keep spaces for now)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from ends
}
