/**
 * Builds a [ngClass]-compatible object from a record of class → condition pairs,
 * plus optional always-on classes passed as a string or string array.
 *
 * Usage:
 *   [ngClass]="classUtil('btn btn-primary', { 'btn-sm': isSmall(), 'disabled': isDisabled() })"
 */
export function classUtil(
  base: string | string[],
  conditional: Record<string, boolean> = {}
): Record<string, boolean> {
  const baseClasses = Array.isArray(base) ? base : base.split(' ').filter(Boolean);
  const result: Record<string, boolean> = {};

  for (const cls of baseClasses) {
    result[cls] = true;
  }

  for (const [cls, condition] of Object.entries(conditional)) {
    if (cls.trim()) {
      result[cls] = condition;
    }
  }

  return result;
}
