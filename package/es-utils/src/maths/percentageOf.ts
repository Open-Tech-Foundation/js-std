function percentageOf(
  percentage: number,
  total: number,
  round?: boolean
): number {
  if (round) {
    return Math.floor((percentage / 100) * total);
  }

  return (percentage / 100) * total;
}

export default percentageOf;
