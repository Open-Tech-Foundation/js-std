/**
 * It returns percentage of a number.
 * @param {number} percentage - The percentage to calculate
 * @param {number} num - The number to find percentage
 * @returns {number}
 */
export default function percentageOf(percentage: number, num: number): number {
  return (percentage / 100) * num;
}
