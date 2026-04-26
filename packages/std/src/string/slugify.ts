/**
 * Converts a string into a URL-friendly slug.
 *
 * @example
 * slugify('Hello World!') //=> 'hello-world'
 * slugify('Café au Lait') //=> 'cafe-au-lait'
 */
export default function slugify(str: string): string {
  return str
    .normalize('NFD') // Split accented characters into their base and accent
    .replace(/[\u0300-\u036f]/g, '') // Remove the accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric (keep spaces for now)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from ends
}
