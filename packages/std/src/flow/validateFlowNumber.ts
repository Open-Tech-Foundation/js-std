export default function validateFlowNumber(
  value: number,
  name: string,
  options: {
    integer?: boolean;
    min?: number;
    allowInfinity?: boolean;
  } = {},
): void {
  const { integer = false, min = 0, allowInfinity = false } = options;

  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    (!allowInfinity && !Number.isFinite(value))
  ) {
    throw new RangeError(`${name} must be a finite number.`);
  }

  if (
    integer &&
    !Number.isInteger(value) &&
    !(allowInfinity && value === Number.POSITIVE_INFINITY)
  ) {
    throw new RangeError(`${name} must be an integer.`);
  }

  if (value < min) {
    throw new RangeError(`${name} must be greater than or equal to ${min}.`);
  }
}
