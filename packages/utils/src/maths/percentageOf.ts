function percentageOf(
  percentage: number,
  num: number,
  floor?: boolean
): number {
  if (floor) {
    return Math.floor((percentage / 100) * num);
  }

  return (percentage / 100) * num;
}

export default percentageOf;
