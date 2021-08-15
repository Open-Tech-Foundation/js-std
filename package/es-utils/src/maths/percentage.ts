function percentage(value: number, total: number, round?: boolean): number {
  if (round) {
    return Math.floor((value / total) * 100);
  }

  return (value / total) * 100;
}

export default percentage;
