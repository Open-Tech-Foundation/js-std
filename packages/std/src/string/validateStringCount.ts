export default function validateStringCount(
  value: number,
  name: string,
): void {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new RangeError(`${name} must be a finite integer.`);
  }

  if (value < 0) {
    throw new RangeError(`${name} must be greater than or equal to 0.`);
  }
}
