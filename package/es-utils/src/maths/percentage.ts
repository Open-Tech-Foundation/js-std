function percentage(value: number, total: number, floor?: boolean): number {
  if (floor) {
    return Math.floor((value / total) * 100);
  }

  return (value / total) * 100;
}

export default percentage;
