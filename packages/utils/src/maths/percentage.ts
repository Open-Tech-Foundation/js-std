/**
 * It returns percentage of value & total.
 * @param {number} value - The current value
 * @param {number} total - The total value
 * @returns {number}
 */
export default function percentage(value: number, total: number): number {
  return (value / total) * 100;
}
